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

const EMPTY_ACCESSORY = new EmptySlot(Slot['ACCESSORY']).name;

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
                return [this.old2newequip(base)];
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

        old2newequip(equip) {
                return old2newequip(this.accslots, this.offhand, equip);
        }

        new2oldequip(equip) {
                let base = new Equip();
                Object.getOwnPropertyNames(Slot).forEach(slot => {
                        for (let i = 0; i < equip[Slot[slot][0]].length; i++) {
                                const name = equip[Slot[slot][0]][i];
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
                let equip = this.old2newequip(base_layout)
                return this.score_equip(equip);
        }

        get_vals_wrapper(base_layout) {
                let equip = this.old2newequip(base_layout)
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

        filter_accs(candidate, accslots, accs) {
                let candidate_accs = candidate.accessory.filter(x => {
                        if (!accs.includes(x)) {
                                // locked accessory
                                return false;
                        }
                        return true;
                });
                return accs.filter(x => !candidate_accs.includes(x));
        }

        get_accs(base_layout, accslots) {
                let accs = this.gear_slot(Slot.ACCESSORY, base_layout);
                accs = this.pareto(accs, accslots);
                let everything = accs.concat(base_layout.items).map((x) => (x.name));
                // sort accessories
                accs = accs.map((x, idx) => idx).sort((a, b) => {
                        // remove accessory a
                        everything[a] = EMPTY_ACCESSORY;
                        const ascore = this.score_equip({accessory: everything});
                        everything[a] = accs[a].name;
                        // remove accessory b
                        everything[b] = EMPTY_ACCESSORY;
                        const bscore = this.score_equip({accessory: everything});
                        everything[b] = accs[b].name;
                        // compare scores
                        return ascore - bscore;
                }).map(x => accs[x].name);
                return accs;
        }

        compute_optimal(base_layouts, factoridx) {
                this.factors = Factors[this.factorslist[factoridx]];
                this.maxslots = this.maxslotslist[factoridx];
                console.log('Priority', factoridx + ':', this.factors[0], this.maxslots)
                if (this.factors[1].length === 0) {
                        return base_layouts;
                }
                // all base layouts should have the same number of available acc slots
                const base_layout = this.new2oldequip(base_layouts[0]);
                const empty_accslots = this.count_accslots(base_layout);
                //TODO: clean this
                const locked_accs = base_layouts[0].accessory.reduce((res, x) => res + (
                        this.itemdata[x].empty
                        ? 0
                        : 1), 0);
                let candidates = this.top_scorers(base_layouts);
                candidates.forEach(x => x.accslots = 0);
                candidates.forEach(x => x.accs = []);
                // expand layout and accessory candidate into proper candidate
                for (let layout = 0; layout < base_layouts.length; layout++) {
                        // find and sort possible accessories
                        const accs = this.get_accs(this.new2oldequip(base_layouts[layout]), empty_accslots);
                        const accslots = Math.min(empty_accslots, accs.length);
                        const acc_candidate = accs.slice(0, accslots);
                        let s = [];
                        const layouts = this.optimize_layouts(this.new2oldequip(base_layouts[layout]), accslots, s).map(x => this.old2newequip(x));
                        console.log('Processing ' + s[2] + ' out of ' + s[1] + ' out of ' + s[0] + ' gear layouts.');
                        for (let idx in layouts) {
                                // combine every gear with every accessory layout
                                let candidate = layouts[idx];
                                if (accslots > 0) {
                                        for (let kdx = 0; kdx < accslots; kdx++) {
                                                candidate.accessory[locked_accs + kdx] = acc_candidate[kdx];
                                        }
                                        let filter_accs = this.filter_accs(candidate, accslots, accs);
                                        let filter_idx = undefined;
                                        while (true) {
                                                let riskidx = undefined;
                                                let score = this.score_equip(candidate);
                                                let riskscore = -1;
                                                let vals = this.get_vals(candidate);
                                                for (let kdx = locked_accs; kdx < locked_accs + accslots; kdx++) {
                                                        const tmp = this.swap_vals([...vals], candidate.accessory[kdx], EMPTY_ACCESSORY)
                                                        const tmpscore = score_vals(tmp, this.factors);
                                                        if (tmpscore > riskscore) {
                                                                riskidx = kdx;
                                                                riskscore = tmpscore;
                                                        }
                                                }
                                                const atrisk = candidate.accessory[riskidx];
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
                                                        candidate.accessory[riskidx] = atrisk;
                                                        break;
                                                } else {
                                                        candidate.accessory[riskidx] = winner;
                                                        filter_accs[filter_idx] = atrisk;
                                                }
                                        }
                                }
                                candidate.accslots = accslots;
                                candidate.accs = [...accs];
                                candidates.push(candidate);
                                candidates = this.top_scorers(candidates);
                        }
                }
                // sort new accs per candidate
                for (let idx in candidates) {
                        let tmp = this.new2oldequip(candidates[idx]);
                        tmp.item_count = tmp.items.length - candidates[idx].accslots;
                        candidates[idx] = {
                                ...this.old2newequip(this.sort_accs(tmp)),
                                accslots: candidates[idx].accslots,
                                accs: candidates[idx].accs
                        };
                }
                // construct alternative candidates
                let alternatives = [...candidates];
                let score = this.score_equip(candidates[0]);
                candidates.forEach(candidate => {
                        const remainder = candidate.accs.filter(x => !candidate.accessory.includes(x));
                        for (let idx = 0; idx < candidate.accslots; idx++) {
                                const tmp = candidate.accessory[locked_accs + idx];
                                for (let jdx in remainder) {
                                        candidate.accessory[locked_accs + idx] = remainder[jdx];
                                        const tmp_score = this.score_equip(candidate);
                                        if (tmp_score === score) {
                                                alternatives.push(clone(candidate));
                                        }
                                        if (tmp_score > score) {
                                                console.log('an error occured');
                                        }
                                }
                                candidate.accessory[locked_accs + idx] = tmp;
                        }
                });
                return alternatives;
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
}
