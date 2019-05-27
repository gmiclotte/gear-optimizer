import {LOCALSTORAGE_NAME} from '../constants';
import {ITEMLIST} from '../assets/Items'
import {Slot, EmptySlot} from '../assets/ItemAux'

import {DISABLE_ITEM} from '../actions/DisableItem';
import {EQUIP_ITEM} from '../actions/EquipItem';
import {UNEQUIP_ITEM} from '../actions/UnequipItem';
import {LOAD_STATE_LOCALSTORAGE} from '../actions/LoadStateLocalStorage';
import {SAVE_STATE_LOCALSTORAGE} from '../actions/SaveStateLocalStorage';

class ItemContainer {
        constructor(items) {
                this.names = [];
                for (let i = 0; i < items.length; i++) {
                        this.names.push(items[i][0]);
                        this[items[i][0]] = items[i][1];
                }
        }
}

let ITEMS = new ItemContainer(ITEMLIST.map((item, index) => {
        return [item.name, item];
}));

const SLOTLIST = [
        [
                Slot.WEAPON, 1
        ],
        [
                Slot.HEAD, 1
        ],
        [
                Slot.CHEST, 1
        ],
        [
                Slot.PANTS, 1
        ],
        [
                Slot.BOOTS, 1
        ],
        [
                Slot.ACCESSORY, 12
        ]
]

let slotlist = []
for (let idx = 0; idx < SLOTLIST.length; idx++) {
        let slot = SLOTLIST[idx][0];
        let count = SLOTLIST[idx][1];
        for (let jdx = 0; jdx < count; jdx++) {
                slotlist.push([
                        slot[0] + jdx,
                        new EmptySlot(slot)
                ]);
        }
}

/*
const EQUIP = new ItemContainer(SLOTLIST.map((slot, index) => {
        return [slot, new EmptySlot(slot)];
}));
*/
const EQUIP = new ItemContainer(slotlist);

const INITIAL_STATE = {
        items: ITEMS,
        equip: EQUIP
};

console.log(INITIAL_STATE);

const ItemsReducer = (state = INITIAL_STATE, action) => {
        switch (action.type) {
                case DISABLE_ITEM:
                        {
                                return {
                                        ...state,
                                        items: {
                                                ...state.items,
                                                [action.payload.name]: {
                                                        ...state.items[action.payload.name],
                                                        disable: !state.items[action.payload.name].disable
                                                }
                                        }
                                };
                        }
                case EQUIP_ITEM:
                        {
                                const item = state.items[action.payload.name];
                                const slot = item.slot[0];
                                let equiped = false;
                                let sel = undefined;
                                for (let idx = 0;; idx++) {
                                        if (state.equip[slot + idx] === undefined) {
                                                if (sel === undefined) {
                                                        sel = idx - 1;
                                                }
                                                break;
                                        }
                                        if (state.equip[slot + idx].empty) {
                                                if (sel === undefined) {
                                                        sel = idx;
                                                }
                                        }
                                        if (state.equip[slot + idx].name === action.payload.name) {
                                                equiped = true;
                                        }
                                }
                                if (equiped) {
                                        return state;
                                }
                                return {
                                        ...state,
                                        equip: {
                                                ...state.equip,
                                                [slot + sel]: item
                                        }
                                };
                        }
                case UNEQUIP_ITEM:
                        {
                                if (action.payload.name.indexOf('Empty ') === 0 && action.payload.name.indexOf(' Slot') > 0) {
                                        return state;
                                }
                                const item = state.items[action.payload.name];
                                const slot = item.slot[0];
                                let idx = 0;
                                for (;; idx++) {
                                        if (state.equip[slot + idx].name === action.payload.name) {
                                                break;
                                        }
                                }
                                return {
                                        ...state,
                                        equip: {
                                                ...state.equip,
                                                [slot + idx]: new EmptySlot(item.slot)
                                        }
                                };
                        }

                case SAVE_STATE_LOCALSTORAGE:
                        {
                                window.localStorage.setItem(LOCALSTORAGE_NAME, JSON.stringify(action.payload.state));
                                return state;
                        }

                case LOAD_STATE_LOCALSTORAGE:
                        {
                                const lc = window.localStorage.getItem(LOCALSTORAGE_NAME);
                                const localStorageState = JSON.parse(lc);
                                if (localStorageState) {
                                        // TODO: Validate local storage state.
                                        return {
                                                ...state,
                                                items: localStorageState.items,
                                                equip: localStorageState.equip
                                        };
                                }
                                return state;
                        }

                default:
                        {
                                return state;
                        }
        }
};

export default ItemsReducer;
