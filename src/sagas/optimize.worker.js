import {Equip, Slot, Factors, ItemNameContainer} from '../assets/ItemAux'
import {Optimizer} from '../Optimizer'
import {old2newequip} from '../util'
import {Augment} from '../Augment'

// eslint-disable-next-line
self.addEventListener("message", choose);

function choose(e) {
        if (e.data.command === 'optimize') {
                optimize.call(this, e);
        } else if (e.data.command === 'augment') {
                augment.call(this, e);
        } else {
                console.log('Error: invalid web worker command: ' + e.data.command + '.')
        }
}

function optimize(e) {
        let start_time = Date.now();
        let state = e.data.state;
        const accslots = state.equip.accessory.length;
        const offhand = state.offhand;
        // construct base layout from locks
        let base_layout = new Equip();
        {
                let optimizer = new Optimizer(state, undefined, undefined, undefined, undefined);
                Object.getOwnPropertyNames(state.locked).forEach(slot => {
                        const locks = state.locked[slot];
                        for (let i = 0; i < locks.length; i++) {
                                const item = state.itemdata[state.equip[slot][locks[i]]];
                                optimizer.add_equip(base_layout, item);
                        }
                });
        }
        // wrap base in an array
        base_layout = [base_layout];
        // optimize the priorities
        for (let idx = 0; idx < state.factors.length; idx++) {
                let factorname = state.factors[idx]
                let factors = Factors[factorname];
                let maxslots = state.maxslots[idx];
                let optimizer = new Optimizer(state, factors, accslots, maxslots, offhand);
                if (e.data.fast) {
                        base_layout = optimizer.fast_optimal(base_layout);
                } else {
                        base_layout = optimizer.compute_optimal(base_layout);
                }
        }
        // select random remaining layout
        base_layout = base_layout[Math.floor(Math.random() * base_layout.length)];
        let equip = old2newequip(accslots, offhand, base_layout);
        {
                //sort locks
                let optimizer = new Optimizer(state, undefined, undefined, undefined, undefined);
                Object.getOwnPropertyNames(Slot).forEach(slotname => {
                        const slot = Slot[slotname][0];
                        const locks = state.locked[slot];
                        if (locks === undefined) {
                                return;
                        }
                        const items = [...equip[slot]];
                        let item_idx = locks.length;
                        let sorted = [];
                        // add the items in the correct order
                        for (let slot_idx = 0; slot_idx < state.equip[slot].length; slot_idx++) {
                                if (locks.includes(slot_idx)) {
                                        const item = state.equip[slot][slot_idx];
                                        sorted.push(item);
                                } else if (item_idx < items.length) {
                                        const item = items[item_idx];
                                        sorted.push(item);
                                        item_idx++;
                                } else {
                                        sorted.push(new EmptySlot(slot).name);
                                }
                        }
                        equip[slot] = sorted;
                });
        }
        this.postMessage({equip: equip});
        console.log(Math.floor((Date.now() - start_time) / 10) / 100 + ' seconds');
        this.close();
}

function augment(e) {
        const start_time = Date.now();
        const state = e.data.state;
        const augment = new Augment(state.augment.lsc, state.augment.time);
        let vals = augment.optimize();
        this.postMessage({vals: vals});
        console.log(Math.floor((Date.now() - start_time) / 10) / 100 + ' seconds');
        this.close();
}
