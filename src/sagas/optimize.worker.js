import {Equip, Factors} from '../assets/ItemAux'
import {Optimizer} from '../Optimizer'
import {old2newequip} from '../util'

// eslint-disable-next-line
self.addEventListener("message", optimize);

function optimize(e) {
        let start_time = Date.now();
        let state = e.data.state;
        const accslots = state.equip.accessory.length;
        const offhand = state.offhand;
        let base_layout = [new Equip()];
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
        base_layout = base_layout[Math.floor(Math.random() * base_layout.length)];
        this.postMessage({
                equip: old2newequip(accslots, offhand, base_layout)
        });
        this.close();
        console.log(Math.floor((Date.now() - start_time) / 10) / 100 + ' seconds')
}
