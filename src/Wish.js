import {Wishes} from './assets/ItemAux'

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

        min_cap() {
                const cost = Wishes[this.wishstats.wishidx][1] * this.wishstats.goal;
                const wishcap = this.wishstats.wishcap/* minutes */ * 60 * 50;
                const powproduct = (this.wishstats.epow * this.wishstats.mpow * this.wishstats.rpow) ** .17;
                const capreq = cost / wishcap / this.wishstats.wishspeed / powproduct;
                const ratio = [
                        this.wishstats.ecap / this.wishstats.rcap,
                        this.wishstats.mcap / this.wishstats.rcap,
                        1
                ];
                const capproduct = ratio.reduce((x, res) => x * res, 1);
                const factor = (capreq / capproduct ** .17) ** (1 / .17 / 3);
                const vals = ratio.map(x => {
                        let val = (x * factor);
                        if (val > 1000) {
                                val = val.toExponential(3);
                        } else {
                                val = Math.ceil(val);
                        }
                        return val >= 1
                                ? val
                                : 1;
                });
                const maxcapproduct = this.wishstats.ecap * this.wishstats.mcap * this.wishstats.rcap;
                const minticks = factor < this.wishstats.rcap
                        ? wishcap
                        : capreq * wishcap / maxcapproduct ** .17;
                let result = [
                        vals[0] + ' E; ' + vals[1] + ' M; ' + vals[2] + ' R3',
                        ''
                ];
                if (factor >= this.wishstats.rcap) {
                        result[1] = this.to_time(minticks);
                }
                return result;
        }

        base(res) {
                let assignment = res.map(x => Math.max(100, Math.floor(x / 1e3)));
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

        optimize() {
                const resource_priority = [1, 0, 2];
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
                                assignments.map(a => a[0].toExponential(3) + ' E; ' + a[1].toExponential(3) + ' M; ' + a[2].toExponential(3) + ' R3'),
                                res[0].toExponential(3) + ' E; ' + res[1].toExponential(3) + ' M; ' + res[2].toExponential(3) + ' R3'
                        ];
                }
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
                scores = assignments.map((a, k) => this.score(coef[k], wishcap, a));
                //unsort the assigned values
                const idxs = coef.map((_, i) => i).sort((a, b) => costs[a] - costs[b]);
                let tmp = Array(l);
                for (let i = 0; i < l; i++) {
                        tmp[idxs[i]] = assignments[i];
                }
                res = res.map(x => Math.max(0, x));
                //console.log(scores.map(x => this.to_time(x)));
                return [
                        this.to_time(Math.max(...scores)),
                        tmp.map(a => a[0].toExponential(3) + ' E; ' + a[1].toExponential(3) + ' M; ' + a[2].toExponential(3) + ' R3'),
                        res[0].toExponential(3) + ' E; ' + res[1].toExponential(3) + ' M; ' + res[2].toExponential(3) + ' R3'
                ];
        }
}
