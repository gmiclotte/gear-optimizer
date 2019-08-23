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

        /*score(cost, wishcap, res, start, goal, x = -0.17) {
                let result = cost;
                for (let i = 0; i < res.length; i++) {
                        result *= res[i] ** x;
                }
                let total = 0;
                for (let i = start + 1; i <= goal; i++) {
                        total += Math.max(wishcap, result / goal * i);
                }
                return total;
        }*/

        score(cost, wishcap, res, start, goal, force = false, x = -0.17) {
                let result = cost;
                for (let i = 0; i < res.length; i++) {
                        result *= res[i] ** x;
                }
                let total = 0;
                for (let i = start + 1; i <= goal; i++) {
                        if (force || result > wishcap) {
                                total += Math.max(wishcap, result / goal * i);
                        } else {
                                total += result / goal * i;
                        }
                }
                return total;
        }

        spread_res(assignments, res, scores, resource_priority, wishcap, exponent, l, totres, coef, start, goal) {
                resource_priority.forEach((i) => {
                        for (let j = l - 1; j >= 0; j--) {
                                if (res[i] < l) {
                                        break;
                                }
                                if (scores[l - 1] === wishcap * (goal[j] - start[j])) {
                                        break;
                                }
                                const ref_score = j === 0
                                        ? wishcap * (goal[j] - start[j])
                                        : scores[j - 1]
                                if (scores[j] === ref_score) {
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
                                scores = assignments.map((a, k) => this.score(coef[k], wishcap, a, start[k], goal[k]));
                        }
                });
                return [assignments, res, scores];
        }

        save_res(assignments, res, scores, resource_priority, wishcap, exponent, l, totres, coef, start, goal, saveidx, spendidx = -1) {
                const save = resource_priority[saveidx];
                const spend = spendidx > -1
                        ? spendidx
                        : resource_priority[getRandomInt(0, saveidx)];
                let w1 = getRandomInt(0, l);
                let w2 = w1;
                while (w1 === w2) {
                        w2 = getRandomInt(0, l);
                };
                scores = assignments.map((a, k) => this.score(coef[k], wishcap, a, start[k], goal[k]));
                if (assignments[w1][spend] > assignments[w2][spend]) {
                        let tmp = w1;
                        w1 = w2;
                        w2 = tmp;
                };
                if (res[spend] > 0) {
                        [w1, w2].forEach(w => {
                                if (res[spend] > 0 && assignments[w][save] > 1) {
                                        const tmp = [...assignments[w]];
                                        assignments[w][spend] = tmp[spend] + res[spend];
                                        if (tmp[spend] / assignments[w][spend] >= 1) {
                                                console.log('error in wish assignment')
                                        }
                                        assignments[w][save] *= tmp[spend] / assignments[w][spend];
                                        assignments[w][save] = Math.ceil(assignments[w][save]);
                                        res = this.update_res(totres, assignments);
                                }
                        });
                }
                const M1 = assignments[w1][spend];
                const M2 = assignments[w2][spend];
                const R1 = assignments[w1][save];
                const R2 = assignments[w2][save];
                const m = M2 / M1;
                const r = R2 / R1;
                /*if (0.999 < m / r && m / r < 1.001) {
                        return [assignments, res, scores];;
                }*/
                if (m * r === 1) {
                        return [assignments, res, scores];;
                }
                const d = (m * r * (m + 1) ** 2) ** 0.5;
                const x1 = (m + 1 + d) / (1 - m * r);
                const x2 = (m + 1 - d) / (1 - m * r);
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
                if (x * M1 > M2 + M1 && x * M1 > M2 + M1 + res[spend]) {
                        console.log('Wish warning: too many resources requested.')
                        return [assignments, res, scores];
                }
                Math.ceil(assignments[w1][spend] = x * M1);
                assignments[w2][spend] = Math.ceil(M2 + M1 - assignments[w1][spend]);
                assignments[w1][save] = Math.ceil(M1 * R1 / assignments[w1][spend]);
                assignments[w2][save] = Math.ceil(M2 * R2 / assignments[w2][spend]);
                let newr = assignments[w1][save] + assignments[w2][save];
                let oldr = R1 + R2;
                if (newr > oldr + 10) {
                        //oops
                        assignments[w1][spend] = M1;
                        assignments[w2][spend] = M2;
                        assignments[w1][save] = R1;
                        assignments[w2][save] = R2;
                }
                res = this.update_res(totres, assignments);
                scores = assignments.map((a, k) => this.score(coef[k], wishcap, a, start[k], goal[k]));
                return [assignments, res, scores];
        }

        optimize() {
                const resource_priority = resource_priorities[this.wishstats.rp_idx];
                const costs = this.wishstats.wishes.map(wish => Wishes[wish.wishidx][1] * wish.goal);
                const wishcap = this.wishstats.wishcap/* minutes */ * 60 * 50;
                const mintottime = Math.max(...this.wishstats.wishes.map(wish => wish.goal - wish.start)) * wishcap;
                const powproduct = (this.wishstats.epow * this.wishstats.mpow * this.wishstats.rpow) ** .17;
                const capproduct = (this.wishstats.ecap * this.wishstats.mcap * this.wishstats.rcap) ** .17;
                const capreqs = costs.map((cost, k) => [
                        cost / this.wishstats.wishspeed / powproduct,
                        this.wishstats.wishes[k].start,
                        this.wishstats.wishes[k].goal
                ]).sort((a, b) => a[0] - b[0]);
                const totres = [
                        Number(this.wishstats.ecap),
                        Number(this.wishstats.mcap),
                        Number(this.wishstats.rcap)
                ];
                let res = [...totres];
                const coef = capreqs.map(c => c[0]);
                const start = capreqs.map(c => c[1]);
                const goal = capreqs.map(c => c[2]);
                const exponent = 0.17;

                let assignments = coef.map((_, i) => this.base(res));
                res = this.update_res(totres, assignments);
                const l = coef.length;
                let scores = coef.map((_, i) => this.score(coef[i], wishcap, assignments[i], start[i], goal[i]));
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
                [assignments, res, scores] = this.spread_res(assignments, res, scores, resource_priority, wishcap, exponent, l, totres, coef, start, goal);
                if (l > 1) {
                        for (let i = 0; i < 1000; i++) {
                                [assignments, res, scores] = this.save_res(
                                        assignments, res, scores, resource_priority, wishcap, exponent, l, totres, coef, start, goal, getRandomInt(0, 5) === 0
                                        ? 1
                                        : 2);
                                let max = Math.floor(Math.max(...scores));
                                scores.forEach((s, k) => {
                                        //console.log(s, k)
                                        if (coef[k] === 0) {
                                                return;
                                        }
                                        resource_priority.forEach((i) => {
                                                if (Math.ceil(s) < max) {
                                                        if (s > max) {
                                                                return;
                                                        }
                                                        let a = assignments[k];
                                                        a[i] = Math.ceil(a[i] * (max / s) ** (-1 / exponent));
                                                        s = this.score(coef[k], wishcap, a, start[k], goal[k]);
                                                        res = this.update_res(totres, assignments);
                                                }
                                        });
                                });
                                res = this.update_res(totres, assignments);
                                scores = assignments.map((a, k) => this.score(coef[k], wishcap, a, start[k], goal[k]));
                                if (Math.floor(Math.max(...scores)) > mintottime + 100) {
                                        [assignments, res, scores] = this.spread_res(assignments, res, scores, resource_priority, wishcap, exponent, l, totres, coef, start, goal);
                                }
                        }
                        for (let i = 0; i < 100; i++) {
                                [assignments, res, scores] = this.save_res(assignments, res, scores, resource_priority, wishcap, exponent, l, totres, coef, start, goal, 2);
                                if (Math.floor(Math.max(...scores)) > mintottime + 100) {
                                        [assignments, res, scores] = this.spread_res(assignments, res, scores, resource_priority, wishcap, exponent, l, totres, coef, start, goal);
                                }
                        }
                        for (let i = 0; i < 100; i++) {
                                [assignments, res, scores] = this.save_res(assignments, res, scores, resource_priority, wishcap, exponent, l, totres, coef, start, goal, 1);
                                if (Math.floor(Math.max(...scores)) > mintottime + 100) {
                                        [assignments, res, scores] = this.spread_res(assignments, res, scores, resource_priority, wishcap, exponent, l, totres, coef, start, goal);
                                }
                        }
                }

                scores = assignments.map((a, k) => this.score(coef[k], wishcap, a, start[k], goal[k], true));

                console.log(coef)
                console.log(start)
                console.log(goal)
                console.log(res);
                console.log(scores.map(x => Math.floor(x)))

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
