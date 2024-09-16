import {EmptySlot, EmptySlotId, Equip, Factors, Slot} from './assets/ItemAux'
import {
    allowed_zone,
    clone,
    cubeBaseItemData,
    get_limits,
    get_raw_vals,
    old2newequip,
    score_equip,
    score_raw_equip
} from './util.js'

export class Optimizer {
    constructor(state) {
        this.itemnames = state.items;
        this.itemdata = cubeBaseItemData(state.itemdata, state.cubestats, state.basestats);
        this.factorslist = state.factors;
        this.maxslotslist = state.maxslots;
        this.accslots = state.equip.accessory.length;
        this.offhand = state.offhand * 5;
        this.limits = get_limits(state);
        this.capstats = state.capstats;
        this.ignoreDisabled = !!state.ignoreDisabled;
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
        base = this.old2newequip(base);
        // wrap base in an array
        return [base];
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
                    sorted.push(EmptySlotId(slotname));
                }
            }
            result[slot] = sorted;
        });
        return result;
    }

    old2newequip(equip) {
        // create new equip
        return {
            ...old2newequip(this.accslots, this.offhand, equip),
            other: [1000, 1001]
        };
    }

    new2oldequip(equip) {
        let base = new Equip();
        Object.getOwnPropertyNames(Slot).forEach(slot => {
            for (let i = 0; i < equip[Slot[slot][0]].length; i++) {
                const id = equip[Slot[slot][0]][i];
                const item = this.itemdata[id];
                this.add_equip(base, item);
            }
        });
        return base;
    }

    score_equip(equip) {
        return score_equip(this.itemdata, equip, this.factors, this.offhand, this.capstats);
    }

    score_raw_equip(equip) {
        return score_raw_equip(this.itemdata, equip, this.factors, this.offhand);
    }

    get_raw_vals(equip) {
        return get_raw_vals(this.itemdata, equip, this.factors, this.offhand);
    }

    score_equip_wrapper(base_layout) {
        let equip = this.old2newequip(base_layout);
        return this.score_equip(equip);
    }

    score_raw_equip_wrapper(base_layout) {
        let equip = this.old2newequip(base_layout);
        return this.score_raw_equip(equip);
    }

    top_scorers(optimal) {
        const scores = optimal.map(x => this.score_equip(x));
        const max = Math.max(...scores);
        return optimal.filter((x, idx) => scores[idx] === max);
    }

    sort_accs(equip) {
        let optimal_size = equip.items.length;
        let scores = [];
        for (let jdx = Math.max(0, equip.item_count); jdx < optimal_size; jdx++) {
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
            let slot = Slot[x[0]][0];
            if (slot === 'accessory' || slot === 'other') {
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
                        if (equip.items.map(val => val.id).filter(name => name === item.id).length > 0) {
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
            return accs.includes(x); // false if locked accessory
        });
        return accs.filter(x => !candidate_accs.includes(x));
    }

    get_accs(base_layout, accslots) {
        let accs = this.gear_slot(Slot.ACCESSORY, base_layout);
        accs = this.pareto(accs, accslots);
        let everything = accs.concat(base_layout.items).map((x) => (x.id));
        // sort accessories
        accs = accs.map((x, idx) => idx).sort((a, b) => {
            // remove accessory a
            everything[a] = EmptySlotId('accessory');
            const ascore = this.score_equip({accessory: everything});
            everything[a] = accs[a].id;
            // remove accessory b
            everything[b] = EmptySlotId('accessory');
            const bscore = this.score_equip({accessory: everything});
            everything[b] = accs[b].id;
            // compare scores
            return ascore - bscore;
        }).map(x => accs[x].id);
        return accs;
    }

    replacement_score(layout, idx, alternative) {
        const tmp = layout.accessory[idx];
        layout.accessory[idx] = alternative;
        const tmp_score = this.score_equip(layout);
        const rawtmp_score = this.score_raw_equip(layout);
        layout.accessory[idx] = tmp;
        return [tmp_score, rawtmp_score]
    }

    compute_optimal(base_layouts, factoridx) {
        this.factors = Factors[this.factorslist[factoridx]];
        this.maxslots = this.maxslotslist[factoridx];
        console.log('Priority', factoridx + ':', this.factors[0], this.maxslots);
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
            let accslots = Math.min(empty_accslots, accs.length);
            const acc_candidate = accs.slice(0, accslots);
            let s = [];
            const layouts = this.optimize_layouts(this.new2oldequip(base_layouts[layout]), accslots, s).map(x => this.old2newequip(x));
            console.log('Processing ' + s[2] + ' out of ' + s[1] + ' out of ' + s[0] + ' gear layouts.');
            for (let idx in layouts) {
                // combine every gear with every accessory layout
                let candidate = layouts[idx];
                candidate.base_idx = layout;
                if (accslots > 0) {
                    for (let kdx = 0; kdx < accslots; kdx++) {
                        candidate.accessory[locked_accs + kdx] = acc_candidate[kdx];
                    }
                    let filter_accs = this.filter_accs(candidate, accslots, accs);
                    while (accslots > 0 && filter_accs.length > 0) {
                        let riskidxes = [];
                        let other = [];
                        let score = this.score_equip(candidate);
                        let rawscore = this.score_raw_equip(candidate);
                        let riskscore = -1;
                        let rawriskscore = -1;
                        // detect acc that contributes the least
                        for (let kdx = locked_accs; kdx < locked_accs + accslots; kdx++) {
                            const tmpscores = this.replacement_score(candidate, kdx, EmptySlotId('accessory'));
                            const tmpscore = tmpscores[0];
                            const rawtmpscore = tmpscores[1];
                            if (tmpscore > riskscore || (tmpscore === riskscore && rawtmpscore > rawriskscore)) {
                                riskidxes = [
                                    ...riskidxes,
                                    kdx
                                ];
                                riskscore = tmpscore;
                                rawriskscore = rawtmpscore;
                            } else {
                                other = [
                                    ...other,
                                    kdx
                                ];
                            }
                        }
                        riskidxes = [
                            ...riskidxes,
                            ...other
                        ];
                        let winner = undefined;
                        let done = false;
                        for (let riskidxidx = riskidxes.length - 1; riskidxidx >= 0; riskidxidx--) {
                            const riskidx = riskidxes[riskidxidx];
                            const atrisk = candidate.accessory[riskidx];
                            winner = undefined;
                            filter_accs = [
                                ...filter_accs,
                                EmptySlotId('accessory')
                            ];
                            // try every available acc as a replacement for least contributing current acc
                            let filter_idx = undefined;
                            for (let kdx in filter_accs) {
                                const acc = filter_accs[kdx];
                                const tmpscores = this.replacement_score(candidate, riskidx, acc);
                                const tmpscore = tmpscores[0];
                                const rawtmpscore = tmpscores[1];
                                if (tmpscore > score || (tmpscore === score && rawtmpscore > rawscore) || (tmpscore === score && this.itemdata[acc].empty)) {
                                    score = tmpscore;
                                    rawscore = rawtmpscore;
                                    winner = acc;
                                    filter_idx = kdx;
                                }
                            }
                            // if no winner is found, the next best acc is at risk
                            if (winner === undefined && riskidxidx > 0) {
                                continue;
                            }
                            // if no winner is found, we're done,
                            if (winner === undefined && riskidxidx === 0) {
                                done = true;
                                break;
                            }
                            // if a winner is found replace the least contributing with the winner
                            candidate.accessory[riskidx] = winner;
                            filter_accs[filter_idx] = atrisk;
                            if (this.itemdata[winner].empty) {
                                accslots--;
                            }
                        }
                        if (done) {
                            break;
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
                accs: candidates[idx].accs,
                base_idx: candidates[idx].base_idx,
            };
        }
        // construct alternative candidates
        let alternatives = [...candidates];
        let score = this.score_equip(candidates[0]);
        let rawscore = this.score_raw_equip(candidates[0]);
        candidates.forEach(candidate => {
            const remainder = candidate.accs.filter(x => !candidate.accessory.includes(x));
            for (let idx = 0; idx < candidate.accslots; idx++) {
                const tmp = candidate.accessory[locked_accs + idx];
                for (let jdx in remainder) {
                    const tmpscores = this.replacement_score(candidate, locked_accs + idx, remainder[jdx]);
                    const tmp_score = tmpscores[0];
                    const rawtmp_score = tmpscores[1];
                    if (tmp_score === score && rawtmp_score === rawscore) {
                        let cc = clone(candidate);
                        cc.accessory[locked_accs + idx] = remainder[jdx];
                        alternatives.push(cc);
                        console.log('alternative found')
                    }
                    if (tmp_score > score) {
                        console.log('error: alternative ', remainder[jdx], 'scores better than ', tmp);
                    }
                }
            }
        });
        // remove gear that doesn't contribute due to hard caps
        alternatives = alternatives.map(candidate => {
            Object.getOwnPropertyNames(Slot).forEach(slot => {
                if (slot === 'OTHER') {
                    return;
                }
                if (candidate.base_idx === undefined) {
                    // this is an unmodified base layout, don't touch it
                    return;
                }
                const slotname = Slot[slot][0];
                let initial = 0;
                base_layouts[candidate.base_idx][slotname].forEach(item => {
                    initial += this.itemdata[item].empty
                        ? 0
                        : 1;
                });
                const current = candidate[slotname].length;
                for (let idx = initial; idx < current; idx++) {
                    const tmp = candidate[slotname][idx];
                    if (this.itemdata[tmp].empty) {
                        continue;
                    }
                    candidate[slotname][idx] = EmptySlotId(slotname);
                    const tmp_score = this.score_equip(candidate);
                    if (tmp_score === score) {
                        console.log('Dropped ' + tmp + ' from optimal loadout.');
                    } else {
                        candidate[slotname][idx] = tmp;
                    }
                }
            });
            return {...candidate, base_idx: undefined} // set base_idx undefined so it isn't used in a future priority
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
        item = equip.items.filter((x) => (x.id === item.id))[0];
        if (item === undefined) {
            return equip;
        }
        for (let i = 0; i < item.statnames.length; i++) {
            const stat = item.statnames[i];
            equip[stat] -= item[stat];
        }
        equip.items = equip.items.filter((x) => (x.id !== item.id));
        equip.counts[item.slot[0]] -= 1;
        return equip;
    }

    gear_slot(type, equip) {
        const equiped = equip.items.filter((item) => (item.slot[0] === type[0])).map((x) => (x.id));
        return this.itemnames.filter((name) => {
            if (!allowed_zone(this.itemdata, this.limits, name)) {
                return false;
            }
            return this.itemdata[name].slot[0] === type[0];
        }).map((name) => (this.itemdata[name])).filter((item) => ((this.ignoreDisabled || !item.disable) && !equiped.includes(item.id)));
    }

    //set <equal> to <false> if equal results result in a dominate call
    dominates(major, minor, equal = true) {
        let l = this.factors[1].length;
        let major_stats = new Array(l).fill(0);
        let minor_stats = new Array(l).fill(0);
        for (let i = 0; i < l; i++) {
            let stat = this.factors[1][i];
            let idx = major.statnames.indexOf(stat);
            const exponent = this.factors.length > 2
                ? this.factors[2][i]
                : 1;
            if (idx >= 0) {
                major_stats[i] = major[stat] ** exponent;
            } else {
                minor_stats[i] = exponent > 0 || minor.empty
                    ? 0
                    : 1;
            }
            idx = minor.statnames.indexOf(stat);
            if (idx >= 0) {
                minor_stats[i] = minor[stat] ** exponent;
            } else {
                minor_stats[i] = exponent > 0 || major.empty
                    ? 0
                    : 1;
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
