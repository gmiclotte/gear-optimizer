import {LOCALSTORAGE_NAME} from '../constants';
import {ITEMLIST} from '../assets/Items'
import {Slot, EmptySlot} from '../assets/ItemAux'

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
        Slot.WEAPON,
        Slot.HEAD,
        Slot.CHEST,
        Slot.PANTS,
        Slot.BOOTS,
        Slot.ACCESSORY
]

const EQUIP = new ItemContainer(SLOTLIST.map((slot, index) => {
        return [slot, new EmptySlot(slot)];
}));

const INITIAL_STATE = {
        items: ITEMS,
        equip: EQUIP
};

console.log(INITIAL_STATE);

const ItemsReducer = (state = INITIAL_STATE, action) => {
        switch (action.type) {
                case EQUIP_ITEM:
                        {
                                const item = state.items[action.payload.name];
                                const slot = item.slot;
                                return {
                                        ...state,
                                        equip: {
                                                ...state.equip,
                                                [slot]: item
                                        }
                                };
                        }
                case UNEQUIP_ITEM:
                        {
                                if (action.payload.name.indexOf('Empty ') === 0 && action.payload.name.indexOf(' Slot') > 0) {
                                        return state;
                                }
                                const item = state.items[action.payload.name];
                                const slot = item.slot;
                                return {
                                        ...state,
                                        equip: {
                                                ...state.equip,
                                                [slot]: new EmptySlot(slot)
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
