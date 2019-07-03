import {Slot} from '../assets/ItemAux'
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

function augment(e) {
        const start_time = Date.now();
        const state = e.data.state;
        const augment = new Augment(state.augment.lsc, state.augment.time);
        let vals = augment.optimize();
        this.postMessage({vals: vals});
        console.log(Math.floor((Date.now() - start_time) / 10) / 100 + ' seconds');
        this.close();
}
