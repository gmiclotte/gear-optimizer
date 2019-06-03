import {
        ItemContainer,
        Equip,
        Slot,
        EmptySlot,
        Factors,
        update_level,
        slotlist
} from '../assets/ItemAux'
import {clone, compute_optimal} from '../util'

// eslint-disable-next-line
self.addEventListener("message", optimize);

function optimize(e) {
        let start_time = Date.now();
        let state = e.data.state;
        let base_layout = [new Equip()];
        for (let idx = 0; idx < state.factors.length; idx++) {
                let factorname = state.factors[idx]
                let factor = Factors[factorname][1];
                let maxslots = state.maxslots[idx];
                base_layout = compute_optimal(state.items.names, state.items, factor, state.accslots, maxslots, base_layout, state.zone);
        }
        base_layout = base_layout[Math.floor(Math.random() * base_layout.length)];
        let equip = new ItemContainer(slotlist(state.accslots));
        let counts = Object.getOwnPropertyNames(Slot).map((x) => (0));
        for (let idx = 0; idx < base_layout.items.length; idx++) {
                const item = base_layout.items[idx];
                equip[item.slot[0] + counts[item.slot[1]]] = item;
                counts[item.slot[1]]++;
        }
        this.postMessage({equip: equip});
        this.close();
        console.log(Math.floor((Date.now() - start_time) / 10) / 100 + ' seconds')
}
