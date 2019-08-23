import {Wishes, resource_priorities} from './assets/ItemAux';

// [min, max[
function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
}

const shortenExponential = (val) => {
        if (val < 10000) {
                return val;
        }
        return (val - 10 ** Math.floor(Math.log10(val) - 3)).toExponential(3);
        //return val.toExponential(3);
}

export class Wish {
        constructor(wishstats) {
                this.wishstats = wishstats;
        }

        to_time(ticks) {
                let result = '';
                let mins = Math.floor(ticks / 50 / 60);
                let days = Math.floor(mins / 60 / 24);
                mins -= days * 24 * 60;
                let hours = Math.floor(mins / 60);
                mins -= hours * 60;
                if (days > 0) {
                        result += days + 'd ';
                }
                if (days > 0 || hours > 0) {
                        result += hours + 'h ';
                }
                result += mins + 'm';
                return result;
        }

        base(res) {
                let assignment = res.map(x => 1);
                return assignment;
        }

        update_res(r, A) {
                return r.map((ri, i) => r[i] - A.reduce((res, a) => a[i] + res, 0));
        }

        score(cost, wishcap, res, x = -0.17) {
                let result = cost;
                for (let i = 0; i < res.length; i++) {
                        result *= res[i] ** x;
                }
                return Math.max(wishcap, result)
        }

        spread_res(assignments, res, scores, resource_priority, wishcap, exponent, l, totres, coef) {
                resource_priority.forEach((i) => {
                        for (let j = l - 1; j >= 0; j--) {
                                if (res[i] < l) {
                                        break;
                                }
                                if (scores[l - 1] === wishcap) {
                                        break;
                                }
                                const ref_score = j === 0
                                        ? wishcap
                                        : scores[j - 1]
                                if (scores[l - 1] === ref_score) {
                                        continue;
                                }
                                const ratio = scores[l - 1] / ref_score;
                                let factor = ratio ** (1 / exponent);
                                let s = 0;
                                for (let k = j; k < l; k++) {
                                        s += assignments[k][i];
                                }
                                factor = Math.min(factor, res[i] / s + 1)
                                let required = assignments.map(a => a[i] * factor);
                                /* eslint-disable-next-line no-loop-func */
                                required = assignments.map((a, k) => Math.min(required[k] - a[i], res[i]));
                                for (let k = j; k < l; k++) {
                                        assignments[k][i] += Math.floor(required[k] + 1);
                                }
                                res = this.update_res(totres, assignments)
                                scores = assignments.map((a, k) => this.score(coef[k], wishcap, a));
                        }
                });
                return [assignments, res, scores];
        }

        save_res(assignments, res, scores, resource_priority, wishcap, exponent, l, totres, coef, i) {
                const resid = resource_priority[i];
                let w1 = getRandomInt(0, l);
                let w2 = w1;
                while (w1 === w2) {
                        w2 = getRandomInt(0, l);
                }
                const resid2 = resource_priority[getRandomInt(0, i)];
                if (assignments[w1][resid2] > assignments[w2][resid2]) {
                        let tmp = w1;
                        w1 = w2;
                        w2 = tmp;
                }
                const M1 = assignments[w1][resid2];
                const M2 = assignments[w2][resid2];
                const R1 = assignments[w1][resid];
                const R2 = assignments[w2][resid];
                const m = M2 / M1;
                const r = R2 / R1;
                if (0.999 < m / r && m / r < 1.001) {
                        return [assignments, res, scores];;
                }
                if (m * r === 1) {
                        return [assignments, res, scores];;
                }
                const d = (m * r * (m + 1) ** 2) ** 0.5;
                const x1 = (m + 1 + d) / (1 - m * r);
                const x2 = (m + 1 - d) / (1 - m * r);
                //console.log('x1x2', x1, x2);
                let x;
                if (x1 < 0 && x2 < 0) {
                        console.log('Wish error: both negative.');
                        return [assignments, res, scores];;
                }
                if (x1 < 0) {
                        x = x2;
                } else if (x2 < 0) {
                        x = x1;
                } else {
                        x = x1 < x2
                                ? x1
                                : x2;
                }
                if (x * M1 < M2 + M1 + res[resid2]) {
                        Math.ceil(assignments[w1][resid2] = x * M1);
                } else {
                        console.log('Wish warning: too many resources requested.')
                        return [assignments, res, scores];
                }
                assignments[w2][resid2] = Math.ceil(M2 + M1 - assignments[w1][resid2]);
                assignments[w1][resid] = Math.ceil(M1 * R1 / assignments[w1][resid2]);
                assignments[w2][resid] = Math.ceil(M2 * R2 / assignments[w2][resid2]);
                let newr = assignments[w1][resid] + assignments[w2][resid];
                let oldr = R1 + R2;
                if (newr > oldr + 10) {
                        //oops
                        assignments[w1][resid2] = M1;
                        assignments[w2][resid2] = M2;
                        assignments[w1][resid] = R1;
                        assignments[w2][resid] = R2;
                }
                res = this.update_res(totres, assignments);
                scores = assignments.map((a, k) => this.score(coef[k], wishcap, a));
                // reassign available resources
                const max = Math.floor(Math.max(...scores));
                scores.forEach((s, k) => {
                        let a = assignments[k];
                        if (Math.ceil(s) < max) {
                                resource_priority.forEach((i) => {
                                        a[i] = Math.ceil(a[i] * (max / s) ** (-1 / exponent));
                                        s = this.score(coef[k], wishcap, a);
                                });
                        }
                });
                return [assignments, res, scores];
        }

        optimize() {
                const resource_priority = resource_priorities[this.wishstats.rp_idx];
                const costs = this.wishstats.wishes.map(wish => Wishes[wish.wishidx][1] * wish.goal);
                const wishcap = this.wishstats.wishcap/* minutes */ * 60 * 50;
                const powproduct = (this.wishstats.epow * this.wishstats.mpow * this.wishstats.rpow) ** .17;
                const capproduct = (this.wishstats.ecap * this.wishstats.mcap * this.wishstats.rcap) ** .17;
                const capreqs = costs.map(cost => cost / this.wishstats.wishspeed / powproduct).sort((a, b) => a - b);
                const totres = [
                        Number(this.wishstats.ecap),
                        Number(this.wishstats.mcap),
                        Number(this.wishstats.rcap)
                ];
                let res = [...totres];
                let coef = capreqs;
                const exponent = 0.17;

                let assignments = coef.map((_, i) => this.base(res));
                res = this.update_res(totres, assignments);
                const l = coef.length;
                let scores = coef.map((_, i) => this.score(coef[i], wishcap, assignments[i]));
                res = res.map(x => Math.max(0, x));
                if (powproduct === 1 && capproduct === 1) {
                        // quit early
                        return [
                                this.to_time(Math.max(...scores)),
                                assignments.map(a => shortenExponential(a[0]) + ' E; ' + shortenExponential(a[1]) + ' M; ' + shortenExponential(a[2]) + ' R3'),
                                shortenExponential(res[0]) + ' E; ' + shortenExponential(res[1]) + ' M; ' + shortenExponential(res[2]) + ' R3'
                        ];
                };

                // optimize
                for (let i = 2; i > 1; i--) {
                        for (let j = 0; j < 1000; j++) {
                                if (l > 1) {
                                        [assignments, res, scores] = this.save_res(assignments, res, scores, resource_priority, wishcap, exponent, l, totres, coef, i);
                                };
                                [assignments, res, scores] = this.spread_res(assignments, res, scores, resource_priority, wishcap, exponent, l, totres, coef);
                        }
                }

                scores = assignments.map((a, k) => this.score(coef[k], wishcap, a));

                //console.log(res);
                //console.log(scores.map(x => Math.floor(x)))

                //unsort the assigned values
                const idxs = coef.map((_, i) => i).sort((a, b) => costs[a] - costs[b]);
                let tmp = Array(l);
                for (let i = 0; i < l; i++) {
                        tmp[idxs[i]] = assignments[i];
                }
                res = res.map(x => Math.max(0, x));
                return [
                        this.to_time(Math.max(...scores)),
                        tmp.map(a => shortenExponential(a[0]) + ' E; ' + shortenExponential(a[1]) + ' M; ' + shortenExponential(a[2]) + ' R3'),
                        shortenExponential(res[0]) + ' E; ' + shortenExponential(res[1]) + ' M; ' + shortenExponential(res[2]) + ' R3'
                ];
        }
}
