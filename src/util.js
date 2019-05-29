import {Slot, EmptySlot, Equip} from './assets/ItemAux'

export function compute_optimal(item_names, items, factor, accslots, base_layout) {
        // find all possible items that can be equiped in main slots
        let options = Object.getOwnPropertyNames(Slot).filter((x) => {
                if (Slot[x][0] === 'Accessory') {
                        return false;
                }
                if (base_layout.counts[Slot[x][0]] > 0) {
                        return false;
                }
                return true;
        }).map((x) => (gear_slot(item_names, items, Slot[x], base_layout)));
        let s = [options.map((x) => (x.length)).reduce((a, b) => (a * b), 1)];
        let remaining = options.map((x) => (pareto(x, factor)));
        s.push(remaining.map((x) => (x.length)).reduce((a, b) => (a * b), 1));
        let layouts = outfits(remaining, base_layout);
        let optimal = [new Equip()];
        let optimal_layout_size = 0;
        layouts = pareto(layouts, factor);
        s.push(layouts.length);
        // find all possible accessories
        let accs = gear_slot(item_names, items, Slot.ACCESSORY, base_layout);
        s.push(accs.length);
        accs = pareto(accs, factor, accslots);
        s.push(accs.length);
        console.log('Processing ' + s[2] + ' out of ' + s[1] + ' out of ' + s[0] + ' gear layouts and ' + s[4] + ' out of ' + s[3] + ' accessories.');
        for (let idx in layouts) {
                console.log(s[4]);
                let candidate = knapsack(accs, accslots, layouts[idx], (a) => (1), add_equip, factor);
                if (score_product(optimal[0], factor) < score_product(candidate[0], factor)) {
                        optimal = candidate;
                        optimal_layout_size = layouts[idx].items.length;
                }
        }
        for (let idx in optimal) {
                let optimal_size = optimal[idx].items.length;
                let scores = [];
                for (let jdx = optimal_layout_size; jdx < optimal_size; jdx++) {
                        let item = optimal[idx].items[jdx];
                        let score = score_product(remove_equip(clone(optimal[idx]), item), factor);
                        scores.push([score, item])
                }
                for (let jdx = optimal_layout_size; jdx < optimal_size; jdx++) {
                        optimal[idx].items.pop();
                }
                scores = scores.sort((a, b) => (a[0] - b[0]));
                for (let jdx in scores) {
                        optimal[idx].items.push(scores[jdx][1]);
                }
        }
        console.log(optimal);
        return optimal[Math.floor(Math.random() * optimal.length)];
}

export function add_equip(equip, item) {
        if (item.empty) {
                return equip;
        }
        for (let i = 0; i < item.statnames.length; i++) {
                const stat = item.statnames[i];
                equip[stat] += item[stat];
        }
        equip.items.push(item);
        equip.counts[item.slot[0]] += 1;
        return equip;
}

export function remove_equip(equip, item) {
        if (item.empty) {
                return equip;
        }
        item = equip.items.filter((x) => (x.name === item.name))[0];
        if (item === undefined) {
                return equip;
        }
        for (let i = 0; i < item.statnames.length; i++) {
                const stat = item.statnames[i];
                equip[stat] -= item[stat];
        }
        equip.items.filter((x) => (x.name !== item.name));
        equip.counts[item.slot[0]] -= 1;
        return equip;
}

const cart_aux = (a, b) => [].concat(...a.map(d => b.map(e => [].concat(d, e))));
const cartesian = (a, b, ...c) => (
        b
        ? cartesian(cart_aux(a, b), ...c)
        : a);

export const outfits = (options, base) => {
        if (options.length === 0) {
                return [base];
        }
        let tmp = cartesian(...options).map((items) => {
                let equip = clone(base);
                for (let i = 0; i < items.length; i++) {
                        add_equip(equip, items[i]);
                }
                return equip;
        })
        return tmp;
};

export function score_product(equip, stats) {
        let score = 1;
        for (let idx in stats) {
                let stat = stats[idx];
                score *= equip[stat] / 100;
        }
        return score;
}

export function gear_slot(names, list, type, equip) {
        const equiped = equip.items.filter((item) => (item.slot[0] === type[0])).map((x) => (x.name));
        return names.filter((name) => {
                if (list[name].empty) {
                        return false;
                }
                return list[name].slot[0] === type[0];
        }).map((name) => (list[name])).filter((item) => (!item.disable && !equiped.includes(item.name)));
}

export function format_number(n, d = 2) {
        if (n < 10000) {
                return n.toFixed(d);
        }
        return n.toExponential(d);
}

export function clone(obj) {
        let copy;
        // Handle the 3 simple types, and null or undefined
        if (null == obj || "object" != typeof obj) 
                return obj;
        
        // Handle Date
        if (obj instanceof Date) {
                copy = new Date();
                copy.setTime(obj.getTime());
                return copy;
        }
        // Handle Array
        if (obj instanceof Array) {
                copy = [];
                for (let i = 0, len = obj.length; i < len; i++) {
                        copy[i] = clone(obj[i]);
                }
                return copy;
        }
        // Handle Object
        if (obj instanceof Object) {
                copy = {};
                for (let attr in obj) {
                        if (obj.hasOwnProperty(attr)) 
                                copy[attr] = clone(obj[attr]);
                        }
                return copy;
        }
        throw new Error("Unable to copy obj! Its type isn't supported.");
}

function knapsack_combine_single(last, list, item, add, factor) {
        last = clone(last);
        for (let idx in list) {
                let max_with = add(clone(list[idx]), item);
                max_with.score = score_product(max_with, factor);
                last.push(max_with);
        }
        last = last.sort((a, b) => (b.score - a.score));
        return pareto(last, factor);
}
/* Energy NGU: 7.33e+6x
Magic NGU: 9.18e+6x
Hack: 3.44x
EM NGU * Hack: 2.31e+14x
Respawn: 20% reduction */

export function knapsack(items, capacity, zero_state, weight, add, factor) {
        let n = items.length;
        zero_state.score = score_product(zero_state, factor);
        // init matrix
        let matrix_weight = new Array(n + 1);
        for (let i = 0; i < n + 1; i++) {
                matrix_weight[i] = new Array(capacity + 1);
        }
        // fill matrix
        for (let i = 0; i <= n; i++) {
                for (let w = 0; w <= capacity; w++) {
                        if (i === 0 || w === 0) {
                                matrix_weight[i][w] = [zero_state];
                                continue;
                        }
                        if (weight(items[i - 1]) > w) {
                                matrix_weight[i][w] = matrix_weight[i - 1][w];
                                continue;
                        }
                        // compute optimal state with item i added
                        // clone earlier entries to avoid changing them
                        let remaining = w - weight(items[i - 1]);
                        matrix_weight[i][w] = knapsack_combine_single(clone(matrix_weight[i - 1][w]), clone(matrix_weight[i - 1][remaining]), items[i - 1], add, factor)
                }
        }
        matrix_weight[n][capacity].sort((a, b) => (b.score - a.score))
        let top_score = matrix_weight[n][capacity][0].score;
        return matrix_weight[n][capacity].filter((x) => (x.score === top_score));
}

/*
        set <equal> to <false> if equal results result in a dominate call
*/
export function dominates(major, minor, stats, equal = true) {
        let major_stats = new Array(stats.length).fill(0);
        let minor_stats = new Array(stats.length).fill(0);
        for (let i = 0; i < stats.length; i++) {
                let stat = stats[i];
                let idx = major.statnames.indexOf(stat);
                if (idx >= 0) {
                        major_stats[i] = major[stat];
                }
                idx = minor.statnames.indexOf(stat);
                if (idx >= 0) {
                        minor_stats[i] = minor[stat];
                }
                if (minor_stats[i] > major_stats[i]) {
                        return false;
                }
                if (minor_stats[i] < major_stats[i]) {
                        equal = false;
                }
        }
        return !equal;
}

export function pareto(list, stats, cutoff = 1) {
        let dominated = new Array(list.length).fill(false);
        let empty = list[0].slot === undefined
                ? new Equip()
                : new EmptySlot(list[0].slot);
        for (let i = list.length - 1; i > -1; i--) {
                if (dominates(empty, list[i], stats, false)) {
                        dominated[i] = cutoff;
                }
                if (dominated[i] === cutoff) {
                        continue;
                }
                for (let j = list.length - 1; j > -1; j--) {
                        if (dominated[j] === cutoff) {
                                continue;
                        }
                        dominated[j] += dominates(list[i], list[j], stats)
                                ? 1
                                : 0;
                }
        }
        let result = dominated.map((val, idx) => (
                val < cutoff
                ? list[idx]
                : false)).filter((val) => (val !== false));
        if (result.length === 0) {
                result = [empty];
        }
        return result;
}
