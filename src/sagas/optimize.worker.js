/* eslint-disable-next-line no-restricted globals */

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

self.onmessage = function(e) {
        let state = e.data.state;
        let base_layout = [new Equip()];
        for (let idx = 0; idx < state.factors.length; idx++) {
                let factorname = state.factors[idx]
                let factor = Factors[factorname][1];
                let maxslots = state.accslots;
                if (factorname === 'RESPAWN') {
                        maxslots = state.respawn;
                }
                if (factorname === 'DAYCARE_SPEED') {
                        maxslots = state.daycare;
                }
                base_layout = compute_optimal(state.items.names, state.items, factor, state.accslots, maxslots, base_layout);
        }
        base_layout = base_layout[Math.floor(Math.random() * base_layout.length)];
        let equip = new ItemContainer(slotlist(state.accslots));
        let counts = Object.getOwnPropertyNames(Slot).map((x) => (0));
        for (let idx in base_layout.items) {
                const item = base_layout.items[idx];
                equip[item.slot[0] + counts[item.slot[1]]] = item;
                counts[item.slot[1]]++;
        }
        self.postMessage({equip: equip});
        self.close();
}
