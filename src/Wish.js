import {Factors, resource_priorities, Wishes} from './assets/ItemAux';
import {speedmodifier} from './util';

// [min, max[
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

export class Wish {
    constructor(state) {
        this.wishstats = state.wishstats;
        this.state = state;
    }

    speed(exponent) {
        let speed = this.wishstats.wishspeed;
        speed *= speedmodifier(this.wishstats, this.state, Factors.WISHES, {
            eBetaPot: 2,
            eDeltaPot: 2,
            mBetaPot: 2,
            mDeltaPot: 2,
            rBetaPot: 2,
            rDeltaPot: 3
        }, exponent);
        return speed;
    }

    cap_modifiers() {
        const ecap = speedmodifier(this.wishstats, this.state, Factors.ENERGY_CAP, {});
        const mcap = speedmodifier(this.wishstats, this.state, Factors.MAGIC_CAP, {});
        const rcap = speedmodifier(this.wishstats, this.state, Factors.RES3_CAP, {});
        return [ecap, mcap, rcap];
    }

    base(res) {
        return res.map(x => Math.max(1e3, Math.floor(x / 1e5)));
    }

    split(res, count) {
        return res.map(x => Math.max(1e3, Math.floor(x / count)));
    }

    update_res(r, A) {
        return r.map((ri, i) => r[i] - A.reduce((res, a) => a[i] + res, 0));
    }

    score(cost, wishcap, res, start, goal, x = -0.17) {
        let result = cost;
        for (let i = 0; i < res.length; i++) {
            result *= res[i] ** x;
        }
        let total = 0;
        for (let i = start + 1; i <= goal; i++) {
            total += Math.max(wishcap, result / goal * i);
        }
        return Math.ceil(total);
    }

    score_raw(cost, wishcap, res, start, goal, force = false, x = -0.17) {
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
        return Math.ceil(total);
    }

    score_true(cost, wishcap, res, start, goal, x = -0.17) {
        if (!this.wishstats.trueTime) {
            return 0;
        }
        let result = cost;
        for (let i = 0; i < res.length; i++) {
            result *= res[i] ** x;
        }
        let total = 0;
        let total_to_level = 0;
        let level = start
        for (let i = start + 1; i <= goal; i++) {
            let actual = this.actualtime(Math.max(wishcap, result / goal * i));
            let time = actual[0]
            let time_to_progress = actual[1]
            let progress = actual[2]
            total += time
            total_to_level += time_to_progress
            level += progress
            if (progress < 1) {
                break
            }
        }
        return [Math.ceil(total), Math.ceil(total_to_level), level];
    }

    spread_res(assignments, res, scores, resource_priority, wishcap, exponent, l, totres, coef, start, goal, minimal = 0) {
        const mincap = Math.max(...coef.map((_, i) => goal[i] - start[i])) * wishcap;
        resource_priority.forEach((i) => {
            for (let j = l - 1; j >= minimal; j--) {
                let count = 0;
                while (count < 1000) {
                    //might require quite a few iterations when doing
                    //a single wish with multiple levels, but probably less than 20
                    count++;
                    if (res[i] < l) {
                        break;
                    }
                    if (scores[l - 1] === wishcap * (goal[j] - start[j])) {
                        break;
                    }
                    const ref_score = j === 0 || scores[j - 1] === 0
                        ? mincap
                        : scores[j - 1] > mincap
                            ? scores[j - 1]
                            : mincap;
                    if (scores[j] === ref_score) {
                        break;
                    }
                    const ratio = scores[l - 1] / ref_score;
                    let factor = ratio ** (1 / exponent);
                    let s = 0;
                    for (let k = j; k < l; k++) {
                        s += assignments[k][i];
                    }
                    factor = Math.min(factor, res[i] / s + 1);
                    let required = assignments.map(a => a[i] * factor);
                    /* eslint-disable-next-line no-loop-func */
                    required = assignments.map((a, k) => Math.min(required[k] - a[i], res[i]));
                    // assign additional resources and update remainder and score
                    let changed = 0;
                    for (let k = j; k < l; k++) {
                        changed += Math.floor(required[k] + 1) / assignments[k][i];
                        assignments[k][i] += Math.floor(required[k] + 1);
                    }
                    if (changed < 1e-4) {
                        // nothing much is changing anymore
                        break;
                    }
                    res = this.update_res(totres, assignments);
                    scores = assignments.map((a, k) => this.score(coef[k], wishcap, a, start[k], goal[k]));
                }
            }
        });
        res = this.update_res(totres, assignments);
        scores = assignments.map((a, k) => this.score(coef[k], wishcap, a, start[k], goal[k]));
        return [assignments, res, scores];
    }

    topoff(coef, assignment, res, wishcap, start, goal, exponent, resource_priority) {
        const score = this.score(coef, wishcap, assignment, goal - 1, goal);
        let factor = (score / wishcap) ** (1 / exponent);
        resource_priority.forEach((i) => {
            if (res[i] === 0) {
                return;
            }
            let previous = assignment[i];
            let tmp = Math.min(factor * previous, previous + res[i]);
            if (tmp < previous) {
                return;
            }
            factor = factor * (previous / tmp);
            assignment[i] = tmp;
        });
        return assignment;
    }

    save_res(assignments, res, scores, resource_priority, wishcap, exponent, l, totres, coef, start, goal, saveidx, spendidx, minimal) {
        const save = resource_priority[saveidx];
        const spend = spendidx > -1
            ? spendidx
            : resource_priority[getRandomInt(0, saveidx)];
        let w1 = getRandomInt(minimal, l);
        while (goal[w1] === 0) {
            w1 = getRandomInt(minimal, l);
        }
        let w2 = w1;
        while (w1 === w2 || goal[w2] === 0) {
            w2 = getRandomInt(minimal, l);
        }

        if (assignments[w1][save] <= this.BASE[save] && assignments[w2][save] <= this.BASE[save]) {
            return [assignments, res, scores];
        }
        scores = assignments.map((a, k) => this.score(coef[k], wishcap, a, start[k], goal[k]));
        if (assignments[w1][spend] > assignments[w2][spend]) {
            let tmp = w1;
            w1 = w2;
            w2 = tmp;
        }

        if (res[spend] > 0) {
            [w1, w2].forEach(w => {
                if (res[spend] > 0 && assignments[w][save] > 1) {
                    const tmp = [...assignments[w]];
                    assignments[w][spend] = Math.ceil(tmp[spend] + res[spend]);
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
        if (m * r === 1) {
            return [assignments, res, scores];
        }
        const d = (m * r * (m + 1) ** 2) ** 0.5;
        const x1 = (m + 1 + d) / (1 - m * r);
        const x2 = (m + 1 - d) / (1 - m * r);
        let x;
        if (x1 < 0 && x2 < 0) {
            console.log('Wish error: both negative.');
            return [assignments, res, scores];

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
        assignments[w1][spend] = Math.max(this.BASE[spend], Math.ceil(x * M1));
        assignments[w2][spend] = Math.max(this.BASE[spend], Math.ceil(M2 + M1 - assignments[w1][spend]));
        assignments[w1][save] = Math.max(this.BASE[save], Math.ceil(M1 * R1 / assignments[w1][spend]));
        assignments[w2][save] = Math.max(this.BASE[save], Math.ceil(M2 * R2 / assignments[w2][spend]));
        let newr = assignments[w1][save] + assignments[w2][save];
        let oldr = R1 + R2;
        if (oldr - newr < this.BASE[save]) {
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

    capPct(x) {
        return this.wishstats[`${x}cap`] * this.wishstats[`${x}pct`] / 100;
    }

    optimize() {
        let global_start_time = Date.now();
        const resource_priority = resource_priorities[this.wishstats.rp_idx];
        const costs = this.wishstats.wishes.map(wish => Wishes[wish.wishidx][1] * wish.goal);
        const wishcap = this.wishstats.wishcap/* minutes */ * 60 * 50;
        const mintottime = Math.max(...this.wishstats.wishes.map(wish => wish.goal - wish.start)) * wishcap;
        const powproduct = (this.wishstats.epow * this.wishstats.mpow * this.wishstats.rpow) ** .17;
        const capproduct = (this.capPct('e') * this.capPct('m') * this.capPct('r')) ** .17;
        const exponent = 0.17;
        const capreqs = costs.map((cost, k) => [
            cost / this.speed(exponent) / powproduct,
            this.wishstats.wishes[k].start,
            this.wishstats.wishes[k].goal
        ]).sort((a, b) => a[0] - b[0]);
        const totres = [
            Number(this.capPct('e')),
            Number(this.capPct('m')),
            Number(this.capPct('r'))
        ];
        let res = [...totres];
        const coef = capreqs.map(c => c[0]);
        const start = capreqs.map(c => c[1]);
        const goal = capreqs.map(c => c[2]);

        let assignments = coef.map(_ => this.base(res));
        this.BASE = this.base(res);
        res = this.update_res(totres, assignments);
        const l = coef.length;
        let scores = coef.map((_, i) => this.score(coef[i], wishcap, assignments[i], start[i], goal[i]));
        let minimal = 0;
        while (minimal < scores.length && scores[minimal] <= mintottime) {
            minimal++;
        }
        res = res.map(x => Math.max(0, x));
        if (powproduct === 1 && capproduct === 1) {
            // quit early
            return [scores, assignments, res, scores];
        }

        if (this.wishstats.equalResources) {
            assignments = coef.map(_ => this.split(res, coef.length));
            res = [0, 0, 0]
        } else {
            // optimize
            [assignments, res, scores] = this.spread_res(assignments, res, scores, resource_priority, wishcap, exponent, l, totres, coef, start, goal, minimal);
            [assignments, res, scores] = this.optimize_res(assignments, res, scores, resource_priority, wishcap, exponent, l, totres, coef, start, mintottime, goal, minimal, costs)
        }
        scores = assignments.map((a, k) => this.score(coef[k], wishcap, a, start[k], goal[k]));
        let true_scores = assignments.map((a, k) => this.score_true(coef[k], wishcap, a, start[k], goal[k]));

        //unsort the assigned values
        const idxs = coef.map((_, i) => i).sort((a, b) => costs[a] - costs[b]);
        let tmp_assignments = Array(l);
        let tmp_scores = Array(l);
        let tmp_true_scores = Array(l);
        for (let i = 0; i < l; i++) {
            tmp_assignments[idxs[i]] = assignments[i];
            tmp_scores[idxs[i]] = scores[i];
            tmp_true_scores[idxs[i]] = true_scores[i];
        }
        assignments = tmp_assignments;
        scores = tmp_scores;
        true_scores = tmp_true_scores;

        const cap_modifiers = this.cap_modifiers();
        res = res.map((x, idx) => Math.max(0, x * cap_modifiers[idx]));
        assignments = assignments.map(assignment => assignment.map((x, idx) => Math.max(0, x * cap_modifiers[idx])));
        console.log(Date.now() - global_start_time + ' ms');
        return [scores, assignments, res, true_scores];
    }

    actualtime(time) {
        if (time > 10 ** 8) {
            return [Infinity, 0, 0];
        }
        let progress = Math.fround(0);
        let ticks = 0;
        const ppt = Math.fround(Math.fround(1) / Math.fround(time));
        const target = Math.fround(1);
        while (progress < target) {
            const next = Math.fround(progress + ppt);
            if (next === progress) {
                console.log('early exit at ', progress * 100, '%');
                return [Infinity, ticks, progress];
            }
            progress = next;
            ticks += 1;
        }
        return [ticks, ticks, 1];
    }

    optimize_res(assignments, res, scores, resource_priority, wishcap, exponent, l, totres, coef, start, mintottime, goal, minimal, costs) {
        if (goal.filter(x => x > 0).length - minimal > 1) {
            const runs = 1000;
            for (let i = 0; i < runs; i++) {
                let save = res[1] <= 0
                    ? getRandomInt(1, 3)
                    : 1;
                [assignments, res, scores] = this.save_res(assignments, res, scores, resource_priority, wishcap, exponent, l, totres, coef, start, goal, save, -1, minimal);
                let max = Math.floor(Math.max(...scores));
                for (let k = minimal; k < coef.length; k++) {
                    if (coef[k] === 0) {
                        continue;
                    }
                    for (let j = 2; j > -1; j--) {
                        let spend = resource_priority[j];
                        let s = this.score(coef[k], wishcap, assignments[k], start[k], goal[k]);
                        const a = assignments[k][spend];
                        if (Math.ceil(s) < max) {
                            assignments[k][spend] = Math.ceil(assignments[k][spend] * (max / s) ** (-1 / exponent));
                            s = Math.ceil(this.score(coef[k], wishcap, assignments[k], start[k], goal[k]));
                            while (s > max) {
                                assignments[k][spend] = Math.max(Math.ceil((assignments[k][spend] + a) / 2 + a / 1000), a);
                                s = Math.ceil(this.score(coef[k], wishcap, assignments[k], start[k], goal[k]));
                            }
                            res = this.update_res(totres, assignments);
                        }
                    }
                }

                if (Math.floor(Math.max(...scores)) === mintottime) {
                    for (let k = minimal; k < coef.length; k++) {
                        if (coef[k] === 0) {
                            continue;
                        }
                        if (scores[k] < mintottime) {
                            continue;
                        }
                        for (let j = 2; j > -1; j--) {
                            let spend = resource_priority[j];
                            let s = this.score(coef[k], wishcap, assignments[k], start[k], goal[k]);
                            const a = assignments[k][spend];
                            let b = a;
                            while (s === mintottime) {
                                b /= 1.1;
                                if (b <= 1) {
                                    b = 1;
                                    break;
                                }
                                assignments[k][spend] = Math.max(this.BASE[spend], Math.floor(b));
                                s = this.score(coef[k], wishcap, assignments[k], start[k], goal[k]);
                            }
                            b = Math.floor(b);
                            if (b === 1 && s === mintottime) {
                                break;
                            }
                            while (s > mintottime) {
                                b *= 1.05;
                                if (b >= a) {
                                    b = a;
                                    break;
                                }
                                assignments[k][spend] = Math.max(this.BASE[spend], Math.ceil(b));
                                s = this.score(coef[k], wishcap, assignments[k], start[k], goal[k]);
                            }
                            res = this.update_res(totres, assignments);
                        }
                    }
                }
                res = this.update_res(totres, assignments);
                scores = assignments.map((a, k) => this.score(coef[k], wishcap, a, start[k], goal[k]));
                if (Math.floor(Math.max(...scores)) > mintottime + 100) {
                    [assignments, res, scores] = this.spread_res(assignments, res, scores, resource_priority, wishcap, exponent, l, totres, coef, start, goal, minimal);
                }
            }
        }
        // spend left overs
        const policy = Number(this.wishstats.spare_policy);
        if (policy > 0) {
            const idxs = policy === 1
                ? coef.map((_, i) => i)
                : policy === 2
                    ? coef.map((_, i) => i).sort((a, b) => costs[a] - costs[b])
                    : [];
            idxs.forEach(k => {
                assignments[k] = this.topoff(coef[k], assignments[k], res, wishcap, start[k], goal[k], exponent, resource_priority);
                res = this.update_res(totres, assignments);
            });
        }
        return [assignments, res, scores]
    }
}
