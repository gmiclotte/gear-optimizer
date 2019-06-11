import {ItemNameContainer, Equip, Slot, Factors} from '../assets/ItemAux'
import {Optimizer} from '../Optimizer'

// eslint-disable-next-line
self.addEventListener("message", optimize);

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
                base_layout = optimizer.compute_optimal(state.items, base_layout);
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
        this.close();
        console.log(Math.floor((Date.now() - start_time) / 10) / 100 + ' seconds')
}
