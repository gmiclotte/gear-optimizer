import {EmptySlot} from './assets/ItemAux'

export function format_number(n) {
        if (n < 10000) {
                return n.toFixed(2);
        }
        return n.toExponential(2);
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

export function knapsack(items, capacity, zero_state, weight, add, score) {
        let n = items.length;
        // init matrix
        let matrix_weight = new Array(n + 1);
        let matrix_to_keep = new Array(n + 1);
        let solution_array = [];
        for (let i = 0; i < n + 1; i++) {
                matrix_weight[i] = new Array(capacity + 1);
                matrix_to_keep[i] = new Array(capacity + 1);
        }
        // fill matrix
        for (let i = 0; i <= n; i++) {
                for (let w = 0; w <= capacity; w++) {
                        if (i === 0 || w === 0) {
                                matrix_weight[i][w] = zero_state;
                                continue;
                        }
                        if (weight(items[i - 1]) > w) {
                                matrix_weight[i][w] = matrix_weight[i - 1][w];
                                continue;
                        }
                        // compute optimal state with item i added
                        // clone earlier entry and item to avoid changing them
                        let remaining = w - weight(items[i - 1]);
                        let max_with = clone(matrix_weight[i - 1][remaining]);
                        max_with = add(max_with, clone(items[i - 1]));
                        // optimal state without item i
                        let max_without = matrix_weight[i - 1][w];
                        if (score(max_with) > score(max_without)) {
                                matrix_weight[i][w] = max_with;
                                matrix_to_keep[i][w] = 1;
                        } else {
                                matrix_weight[i][w] = max_without;
                                matrix_to_keep[i][w] = 0;
                        }
                }
        }
        // backtrace solution
        let remaining = capacity;
        for (let i = n; i > 0; i--) {
                if (matrix_to_keep[i][remaining] === 1) {
                        solution_array.push(items[i - 1]);
                        remaining -= weight(items[i - 1]);
                }
        }
        return [
                matrix_weight[n][capacity],
                solution_array
        ];
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
        console.log(list[0])
        let empty = new EmptySlot(list[0].slot);
        for (let i = list.length - 1; i > -1; i--) {
                if (dominates(empty, list[i], stats, false)) {
                        dominated[i] = cutoff;
                } else {
                        //console.log(empty, list[i])
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
