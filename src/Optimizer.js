import {Slot, EmptySlot, Equip, Factors} from './assets/ItemAux'
import {
        allowed_zone,
        score_equip,
        score_vals,
        get_vals,
        clone,
        get_limits,
        old2newequip
} from './util.js'

export class Optimizer {
        constructor(state, factors, maxslots) {
                this.itemnames = state.items;
                this.itemdata = state.itemdata;
                this.factorslist = state.factors;
                this.maxslotslist = state.maxslots;
                this.accslots = state.equip.accessory.length;
                this.offhand = state.offhand * 5;
                this.limits = get_limits(state);
        }

        construct_base(locked, equip) {
                let base = new Equip();
                Object.getOwnPropertyNames(locked).forEach(slot => {
                        const locks = locked[slot];
                        for (let i = 0; i < locks.length; i++) {
                                const item = this.itemdata[equip[slot][locks[i]]];
                                this.add_equip(base, item);
                        }
                });
                // wrap base in an array
                return [old2newequip(this.accslots, this.offhand, base)];
        }

        sort_locks(locked, equip, result) {
                //sort locks
                Object.getOwnPropertyNames(Slot).forEach(slotname => {
                        const slot = Slot[slotname][0];
                        const locks = locked[slot];
                        if (locks === undefined) {
                                return;
                        }
                        const items = [...result[slot]];
                        let item_idx = locks.length;
                        let sorted = [];
                        // add the items in the correct order
                        for (let slot_idx = 0; slot_idx < equip[slot].length; slot_idx++) {
                                if (locks.includes(slot_idx)) {
                                        const item = equip[slot][slot_idx];
                                        sorted.push(item);
                                } else if (item_idx < items.length) {
                                        const item = items[item_idx];
                                        sorted.push(item);
                                        item_idx++;
                                } else {
                                        sorted.push(new EmptySlot(slot).name);
                                }
                        }
                        result[slot] = sorted;
                });
                return result;
        }

        new2oldequip(equip) {
                let base = new Equip();
                Object.getOwnPropertyNames(equip).forEach(slot => {
                        for (let i = 0; i < equip[slot].length; i++) {
                                const name = equip[slot][i];
                                const item = this.itemdata[name];
                                this.add_equip(base, item);
                        }
                });
                return base;
        }

        score_equip(equip) {
                return score_equip(this.itemdata, equip, this.factors, this.offhand);
        }

        get_vals(equip) {
                return get_vals(this.itemdata, equip, this.factors, this.offhand);
        }

        score_equip_wrapper(base_layout) {
                let equip = old2newequip(this.accslots, this.offhand, base_layout)
                return this.score_equip(equip);
        }

        get_vals_wrapper(base_layout) {
                let equip = old2newequip(this.accslots, this.offhand, base_layout)
                return this.get_vals(equip);
        }

        swap_vals(vals, a, b) {
                const valsa = this.get_vals({accessory: a});
                const valsb = this.get_vals({accessory: b});
                for (let idx in vals) {
                        vals[idx] += valsb[idx] - valsa[idx];
                }
                return vals;
        }

        top_scorers(optimal) {
                const scores = optimal.map(x => score_equip(this.itemdata, x, this.factors, this.offhand));
                const max = Math.max(...scores)
                return optimal.filter((x, idx) => scores[idx] === max);
        }

        sort_accs(equip) {
                let optimal_size = equip.items.length;
                let scores = [];
                for (let jdx = equip.item_count; jdx < optimal_size; jdx++) {
                        let item = equip.items[jdx];
                        let score = this.score_equip_wrapper(this.remove_equip(clone(equip), item));
                        scores.push([score, item])
                }
                for (let jdx = equip.item_count; jdx < optimal_size; jdx++) {
                        equip.items.pop();
                }
                scores = scores.sort((a, b) => (a[0] - b[0]));
                for (let jdx in scores) {
                        equip.items.push(scores[jdx][1]);
                }
                return equip;
        }

        count_accslots(base_layout) {
                let accslots = this.accslots - base_layout.counts['accessory'];
                accslots = this.maxslots < accslots
                        ? this.maxslots
                        : accslots;
                return accslots;
        }

        optimize_layouts(base_layout, accslots, s) {
                // find all possible items that can be equiped in main slots
                let weapons = base_layout.counts['weapon'];
                let options = [
                        [
                                'WEAPON', 100, 'mainhand'
                        ], // mainhand
                        [
                                'WEAPON', this.offhand, 'offhand'
                        ], // offhand
                        [
                                'HEAD', 100
                        ],
                        [
                                'CHEST', 100
                        ],
                        [
                                'PANTS', 100
                        ],
                        [
                                'BOOTS', 100
                        ]
                ].filter((x) => {
                        if (x[1] === 0) {
                                return false;
                        }
                        let slot = Slot[x[0]][0]
                        if (slot === 'accessory') {
                                return false;
                        }
                        if (slot === 'weapon' && x[2] === 'mainhand') {
                                return weapons === 0;
                        }
                        if (slot === 'weapon' && x[2] === 'offhand') {
                                return weapons < 2;
                        }
                        return base_layout.counts[slot] < 1;
                }).map((x) => ([
                        this.gear_slot(Slot[x[0]], base_layout),
                        x[1]
                ]));
                s.push(options.map((x) => (x[0].length)).reduce((a, b) => (a * b), 1));
                let remaining = options.map((x) => {
                        let items = x[0];
                        return [
                                this.pareto(
                                        items, items[0].slot[0] === 'weapon'
                                        ? 2 - base_layout.counts['weapon']
                                        : 1),
                                x[1]
                        ];
                });
                s.push(remaining.map((x) => (x[0].length)).reduce((a, b) => (a * b), 1));
                base_layout.item_count = base_layout.items.length;
                let layouts = [base_layout];
                for (let i = 0; i < remaining.length; i++) {
                        let tmp = clone(layouts);
                        for (let j = 0; j < layouts.length; j++) {
                                for (let k = 0; k < remaining[i][0].length; k++) {
                                        const item = remaining[i][0][k];
                                        if (item.empty) {
                                                continue;
                                        }
                                        let equip = clone(layouts[j]);
                                        if (item.slot[0] === 'weapon') {
                                                // check if weapon is already in mainhand slot
                                                if (equip.items.map(val => val.name).filter(name => name === item.name).length > 0) {
                                                        continue;
                                                }
                                        }
                                        this.add_equip(equip, item);
                                        equip.item_count = equip.items.length;
                                        tmp.push(equip);
                                }
                        }
                        layouts = this.pareto(tmp);
                }
                s.push(layouts.length);
                return layouts;
        }

        filter_accs(candidate, accslots) {
                let accs = this.gear_slot(Slot.ACCESSORY, candidate);
                accs = this.pareto(accs, accslots);
                let candidate_accs = candidate.items.filter(x => {
                        if (x.slot[0] !== 'accessory') {
                                // not an accessory
                                return false;
                        }
                        if (!accs.map(y => y.name).includes(x.name)) {
                                // locked accessory
                                return false;
                        }
                        return true;
                }).map(x => x.name);
                return accs.map(x => x.name).filter(x => !candidate_accs.includes(x));
        }

        fast_optimal(base_layouts, factoridx) {
                this.factors = Factors[this.factorslist[factoridx]];
                this.maxslots = this.maxslotslist[factoridx];
                if (this.factors[1].length === 0) {
                        return base_layouts;
                }
                let candidates = this.top_scorers(base_layouts);
                {
                        let acc_layouts = {};
                        for (let layout = 0; layout < base_layouts.length; layout++) {
                                const base_layout = this.new2oldequip(base_layouts[layout]);
                                const accslots = this.count_accslots(base_layout);
                                // find all possible accessories
                                if (acc_layouts[accslots] === undefined) {
                                        let accs = this.gear_slot(Slot.ACCESSORY, base_layout);
                                        accs = this.pareto(accs, accslots);
                                        {
                                                let everything = new Equip();
                                                for (let idx = 0; idx < accs.length; idx++) {
                                                        this.add_equip(everything, accs[idx]);
                                                }
                                                accs.sort((a, b) => {
                                                        const lista = everything.items.filter((x) => (x.name !== undefined && x.name !== a.name)).map((x) => (x.name));
                                                        const ascore = this.score_equip({accessory: lista});
                                                        const listb = everything.items.filter((x) => (x.name !== undefined && x.name !== b.name)).map((x) => (x.name));
                                                        const bscore = this.score_equip({accessory: listb});
                                                        return ascore - bscore;
                                                });
                                        }
                                        let tmp = clone(base_layout);
                                        for (let idx = 0; idx < accs.length && idx < accslots; idx++) {
                                                this.add_equip(tmp, accs[idx]);
                                        }
                                        acc_layouts[accslots] = [tmp];
                                }
                                let s = [];
                                const layouts = this.optimize_layouts(base_layout, accslots, s);
                                console.log('Processing ' + s[2] + ' out of ' + s[1] + ' out of ' + s[0] + ' gear layouts.');
                                for (let idx in layouts) {
                                        for (let jdx in acc_layouts[accslots]) {
                                                // combine every gear with every accessory layout
                                                let candidate = clone(layouts[idx]);
                                                let acc_candidate = acc_layouts[accslots][jdx];
                                                if (acc_candidate.items.length === 0) {
                                                        candidates.push(old2newequip(this.accslots, this.offhand, candidate));
                                                        continue;
                                                }
                                                for (let kdx = base_layout.items.length; kdx < acc_candidate.items.length; kdx++) {
                                                        this.add_equip(candidate, acc_candidate.items[kdx]);
                                                }
                                                let filter_accs = this.filter_accs(candidate, accslots);
                                                let filter_idx = undefined;
                                                while (true) {
                                                        let riskidx = undefined;
                                                        let score = this.score_equip_wrapper(candidate);
                                                        let riskscore = -1;
                                                        let vals = this.get_vals_wrapper(candidate);
                                                        for (let kdx = layouts[idx].items.length; kdx < candidate.items.length; kdx++) {
                                                                const tmp = this.swap_vals([...vals], candidate.items[kdx].name, new EmptySlot(Slot['ACCESSORY']).name)
                                                                const tmpscore = score_vals(tmp, this.factors);
                                                                if (tmpscore > riskscore) {
                                                                        riskidx = kdx;
                                                                        riskscore = tmpscore;
                                                                }
                                                        }
                                                        const atrisk = candidate.items[riskidx].name;
                                                        let winner = undefined;
                                                        for (let kdx in filter_accs) {
                                                                const acc = filter_accs[kdx];
                                                                const tmp = this.swap_vals([...vals], atrisk, acc);
                                                                const tmpscore = score_vals(tmp, this.factors);
                                                                if (tmpscore > score) {
                                                                        score = tmpscore;
                                                                        winner = acc;
                                                                        filter_idx = kdx;
                                                                }
                                                        }
                                                        if (winner === undefined) {
                                                                candidate.items[riskidx] = this.itemdata[atrisk];
                                                                break;
                                                        } else {
                                                                candidate.items[riskidx] = this.itemdata[winner];
                                                                filter_accs[filter_idx] = atrisk;
                                                        }
                                                }
                                                candidates.push(old2newequip(this.accslots, this.offhand, candidate));
                                        }
                                        candidates = this.top_scorers(candidates);
                                }
                        }
                }
                // sort new accs per candidate
                for (let idx in candidates) {
                        //this.sort_accs(optimal[idx])
                }
                return candidates;
        }

        compute_optimal(base_layouts, factoridx) {
                this.factors = Factors[this.factorslist[factoridx]];
                this.maxslots = this.maxslotslist[factoridx];
                if (this.factors[1].length === 0) {
                        return base_layouts;
                }
                let candidates = this.top_scorers(base_layouts);
                {
                        let acc_layouts = {};
                        for (let layout = 0; layout < base_layouts.length; layout++) {
                                const base_layout = this.new2oldequip(base_layouts[layout]);
                                let s = [];
                                const accslots = this.count_accslots(base_layout);
                                const layouts = this.optimize_layouts(base_layout, accslots, s);
                                // find all possible accessories
                                if (acc_layouts[accslots] === undefined) {
                                        let accs = this.gear_slot(Slot.ACCESSORY, base_layout);
                                        s.push(accs.length);
                                        accs = this.pareto(accs, accslots);
                                        s.push(accs.length);
                                        {
                                                let everything = new Equip();
                                                for (let idx = 0; idx < accs.length; idx++) {
                                                        this.add_equip(everything, accs[idx]);
                                                }
                                                accs.sort((a, b) => {
                                                        let ascore = this.score_equip_wrapper(this.remove_equip(clone(everything), a));
                                                        let bscore = this.score_equip_wrapper(this.remove_equip(clone(everything), b));
                                                        return bscore - ascore;
                                                });
                                        }
                                        console.log('Processing ' + s[4] + ' out of ' + s[3] + ' accessories with ' + accslots + ' slots.');
                                        acc_layouts[accslots] = this.knapsack(accs, accslots, base_layout, this.add_equip);
                                }
                                console.log('Processing ' + s[2] + ' out of ' + s[1] + ' out of ' + s[0] + ' gear layouts.');
                                for (let idx in layouts) {
                                        console.log(acc_layouts[accslots].length);
                                        for (let jdx in acc_layouts[accslots]) {
                                                let candidate = clone(layouts[idx]);
                                                let acc_candidate = acc_layouts[accslots][jdx];
                                                for (let kdx = base_layout.items.length; kdx < acc_candidate.items.length; kdx++) {
                                                        this.add_equip(candidate, acc_candidate.items[kdx]);
                                                }
                                                candidates.push(old2newequip(this.accslots, this.offhand, candidate));
                                        }
                                        candidates = this.top_scorers(candidates);
                                }
                        }
                }
                // sort new accs per candidate
                for (let idx in candidates) {
                        //this.sort_accs(optimal[idx])
                }
                return candidates;
        }

        add_empty(equip, slot) {
                equip.items.push(new EmptySlot(slot));
                equip.counts[slot[0]] += 1;
                return equip;
        }

        add_equip(equip, item, effect = 100) {
                if (item.empty) {
                        return equip;
                }
                for (let i = 0; i < item.statnames.length; i++) {
                        const stat = item.statnames[i];
                        equip[stat] += item[stat] * effect / 100;
                }
                equip.items.push(item);
                equip.counts[item.slot[0]] += 1;
                return equip;
        }

        remove_equip(equip, item) {
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
                equip.items = equip.items.filter((x) => (x.name !== item.name));
                equip.counts[item.slot[0]] -= 1;
                return equip;
        }

        gear_slot(type, equip) {
                const equiped = equip.items.filter((item) => (item.slot[0] === type[0])).map((x) => (x.name));
                return this.itemnames.filter((name) => {
                        if (!allowed_zone(this.itemdata, this.limits, name)) {
                                return false;
                        }
                        return this.itemdata[name].slot[0] === type[0];
                }).map((name) => (this.itemdata[name])).filter((item) => (!item.disable && !equiped.includes(item.name)));
        }

        knapsack_combine_single(last, list, item, add) {
                for (let idx in list) {
                        let max_with = add(clone(list[idx]), item);
                        max_with.score = this.score_equip_wrapper(max_with);
                        list[idx] = max_with;
                }
                list = list.sort((a, b) => (b.score - a.score));
                list = this.pareto(list);
                //both list and last are pareto optimal internally, remains to compare them to eachother
                last = this.pareto_2(list, last);
                list = this.pareto_2(last, list)
                let all = last.concat(list);
                //all is pareto optimal
                all = all.sort((a, b) => (b.score - a.score));
                return all;
        }

        //Assumes all weights are 1.
        knapsack(items, capacity, zero_state, add) {
                let n = items.length;
                zero_state.score = this.score_equip_wrapper(zero_state);
                // init matrix
                let matrix_weight = new Array(n + 1);
                for (let i = 0; i < n + 1; i++) {
                        matrix_weight[i] = new Array(capacity + 1);
                }
                // fill matrix
                for (let i = 0; i <= n; i++) {
                        let start_time = Date.now();
                        for (let w = 0; w <= capacity; w++) {
                                if (i === 0 || w === 0) {
                                        matrix_weight[i][w] = [zero_state];
                                        continue;
                                }
                                // compute optimal state with item i-1 added
                                // clone earlier entries to avoid changing them
                                let last = clone(matrix_weight[i - 1][w]);
                                let list = clone(matrix_weight[i - 1][w - 1]);
                                matrix_weight[i][w] = this.knapsack_combine_single(last, list, items[i - 1], add)
                        }
                        if (i === 0) {
                                continue;
                        }
                        // clear memory
                        matrix_weight[i - 1] = undefined;
                        // print
                        console.log(i + '/' + n + ' ' + Math.floor((Date.now() - start_time) / 10) / 100 + ' ' + matrix_weight[i].reduce((a, b) => (a + b.length), 0) + ' ' + items[i - 1].name);
                }
                return matrix_weight[n][capacity];
        }

        //set <equal> to <false> if equal results result in a dominate call
        dominates(major, minor, equal = true) {
                let l = this.factors[1].length;
                let major_stats = new Array(l).fill(0);
                let minor_stats = new Array(l).fill(0);
                for (let i = 0; i < l; i++) {
                        let stat = this.factors[1][i];
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

        pareto(list, cutoff = 1) {
                let dominated = new Array(list.length).fill(false);
                let empty = list[0].slot === undefined
                        ? new Equip()
                        : new EmptySlot(list[0].slot);
                for (let i = list.length - 1; i > -1; i--) {
                        if (this.dominates(empty, list[i], !empty.empty)) {
                                dominated[i] = cutoff;
                        }
                        if (dominated[i] === cutoff) {
                                continue;
                        }
                        for (let j = list.length - 1; j > -1; j--) {
                                if (dominated[j] === cutoff) {
                                        continue;
                                }
                                dominated[j] += this.dominates(list[i], list[j]);
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

        pareto_2(list, newlist, cutoff = 1) {
                let dominated = new Array(newlist.length).fill(false);
                let empty = list[0].slot === undefined
                        ? new Equip()
                        : new EmptySlot(list[0].slot);
                for (let i = list.length - 1; i > -1; i--) {
                        for (let j = newlist.length - 1; j > -1; j--) {
                                if (dominated[j] === cutoff) {
                                        continue;
                                }
                                dominated[j] += this.dominates(list[i], newlist[j]);
                        }
                }
                let result = dominated.map((val, idx) => (
                        val < cutoff
                        ? newlist[idx]
                        : false)).filter((val) => (val !== false));
                if (result.length === 0) {
                        result = [empty];
                }
                return result;
        }
}
