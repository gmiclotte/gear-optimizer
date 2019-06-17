import {ItemNameContainer, Equip, Slot, Factors} from '../assets/ItemAux'
import {Optimizer} from '../Optimizer'
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
        let base_layout = [new Equip()];
        for (let idx = 0; idx < state.factors.length; idx++) {
                let factorname = state.factors[idx]
                let factors = Factors[factorname];
                let maxslots = state.maxslots[idx];
                let optimizer = new Optimizer(state, factors, accslots, maxslots);
                if (e.data.fast) {
                        base_layout = optimizer.fast_optimal(state.items, base_layout);
                } else {
                        base_layout = optimizer.compute_optimal(state.items, base_layout);
                }
        }
        base_layout = base_layout[Math.floor(Math.random() * base_layout.length)];
        let equip = ItemNameContainer(accslots);
        let counts = Object.getOwnPropertyNames(Slot).map((x) => (0));
        for (let idx = 0; idx < base_layout.items.length; idx++) {
                const item = base_layout.items[idx];
                equip[item.slot[0]][counts[item.slot[1]]] = item.name;
                counts[item.slot[1]]++;
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
