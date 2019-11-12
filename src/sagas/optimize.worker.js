import {ItemNameContainer, Slot} from '../assets/ItemAux'
import {Optimizer} from '../Optimizer'
import {old2newequip} from '../util'
import {Augment} from '../Augment'
import {Wish} from '../Wish'
import {cleanState} from '../reducers/Items'

// eslint-disable-next-line
self.addEventListener("message", choose);

function choose(e) {
        if (e.data.command === 'optimize') {
                optimize.call(this, e);
        } else if (e.data.command === 'optimizeSaves') {
                optimizeSaves.call(this, e);
        } else if (e.data.command === 'augment') {
                augment.call(this, e);
        } else if (e.data.command === 'wishes') {
                augment.call(this, e);
        } else {
                console.log('Error: invalid web worker command: ' + e.data.command + '.')
        }
}

function optimize(e) {
        let start_time = Date.now();
        let state = e.data.state;
        let optimizer = new Optimizer(state);
        // construct base layout from locks
        let base_layout = optimizer.construct_base(state.locked, state.equip);
        // optimize the priorities
        for (let idx = 0; idx < state.factors.length; idx++) {
                base_layout = optimizer.compute_optimal(base_layout, idx);
        }
        // select random remaining layout
        base_layout = base_layout[Math.floor(Math.random() * base_layout.length)];
        let equip = optimizer.sort_locks(state.locked, state.equip, base_layout);
        this.postMessage({equip: equip});
        console.log(Math.floor((Date.now() - start_time) / 10) / 100 + ' seconds');
        this.close();
}

function optimizeSaves(e) {
        let start_time = Date.now();
        const savedequip = e.data.state.savedequip.map(save => {
                if (save.factors === undefined || save.factors.length === 0) {
                        console.log('quit early')
                        return save;
                }
                let state = e.data.state;
                const hasNoFactors = save.factors === undefined && save.maxslots === undefined;
                let equip = ItemNameContainer(state.equip.accessory.length, state.offhand);
                let locked = {};
                if (save.locked === undefined) {
                        save.locked = {};
                }
                Object.getOwnPropertyNames(save.locked).forEach(slot => {
                        equip[slot] = save.locked[slot].concat(equip[slot].slice(save.locked[slot].length));
                        locked[slot] = save.locked[slot].map((_, idx) => idx);
                });
                state = cleanState({
                        ...state,
                        equip: equip,
                        locked: locked,
                        factors: hasNoFactors
                                ? state.factors
                                : save.factors,
                        maxslots: hasNoFactors
                                ? state.maxslots
                                : save.maxslots
                });
                let optimizer = new Optimizer(state);
                // construct base layout from locks
                let base_layout = optimizer.construct_base(state.locked, state.equip);
                // optimize the priorities
                for (let idx = 0; idx < state.factors.length; idx++) {
                        base_layout = optimizer.compute_optimal(base_layout, idx);
                }
                // select random remaining layout
                base_layout = base_layout[Math.floor(Math.random() * base_layout.length)];
                // merge and return base_layout with save
                Object.getOwnPropertyNames(base_layout).forEach(property => {
                        save[property] = base_layout[property];
                });
                return save;
                /*
                return {
                        ...save,
                        ...base_layout
                };
                */
        });
        this.postMessage({savedequip: savedequip});
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

function wish(e) {
        const base = [1]
        const start_time = Date.now();
        const state = e.data.state;
        const wish = new Wish(state);
        let vals = wish.optimize();
        this.postMessage({vals: vals});
        console.log(Math.floor((Date.now() - start_time) / 10) / 100 + ' seconds');
        this.close();
}
