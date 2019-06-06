import {
        ItemNameContainer,
        Equip,
        Slot,
        EmptySlot,
        Factors,
        update_level,
        slotlist
} from '../assets/ItemAux'
import {clone, compute_optimal, get_limits} from '../util'
import {Optimizer} from '../Optimizer'

// eslint-disable-next-line
self.addEventListener("message", optimize);

function optimize(e) {
        let start_time = Date.now();
        let state = e.data.state;
        const accslots = state.equip.accessory.length;
        let base_layout = [new Equip()];
        let limits = get_limits(state);
        for (let idx = 0; idx < state.factors.length; idx++) {
                let factorname = state.factors[idx]
                let factor = Factors[factorname][1];
                let maxslots = state.maxslots[idx];
                let optimizer = new Optimizer(state);
                base_layout = optimizer.compute_optimal(state.items, factor, accslots, maxslots, base_layout, limits);
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
