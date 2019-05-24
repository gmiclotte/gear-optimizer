import {LOCALSTORAGE_NAME} from '../constants';

import {EQUIP_ITEM} from '../actions/EquipItem';
import {UNEQUIP_ITEM} from '../actions/UnequipItem';
import {LOAD_STATE_LOCALSTORAGE} from '../actions/LoadStateLocalStorage';
import {SAVE_STATE_LOCALSTORAGE} from '../actions/SaveStateLocalStorage';

class Item {
        constructor(name, slot, zone, level, props) {
                this.name = name;
                this.slot = slot;
                this.zone = zone;
                this.level = level;
                for (var i = 0; i < props.length; i++) {
                        this[props[i][0]] = props[i][1];
                }
        }
}

class ItemContainer {
        constructor(items) {
                this.names = [];
                for (var i = 0; i < items.length; i++) {
                        this.names.push(items[i][0]);
                        this[items[i][0]] = items[i][1];
                }
        }
}

export const Slot = {
        W: 'Weapon',
        H: 'Head',
        C: 'Armor',
        P: 'Pants',
        B: 'Boots',
        A: 'Accessory'
}

export const Stat = {
        AP: 'AP',
        AT: 'Advance Training',
        AUG: 'Augment Speed',
        BEARD: 'Beard Speed',
        CD: 'Move Cooldown',
        COOKING: 'Cooking',
        DC: 'Daycare Speed',
        DROP: 'Drop Chance',
        EBAR: 'Energy Bars',
        ECAP: 'Energy Cap',
        EPOW: 'Energy Power',
        ESPEED: 'Energy Speed',
        EXP: 'Experience',
        GOLD: 'Gold Drops',
        HACK: 'Hack Speed',
        MBAR: 'Magic Bars',
        MCAP: 'Magic Cap',
        MPOW: 'Magic Power',
        MSPEED: 'Magic Speed',
        NGU: 'NGU Speed',
        P: 'Power',
        QUEST: 'Quest Drops',
        RESPAWN: 'Respawn',
        SEED: 'Seed Gain',
        T: 'Toughness',
        WAN: 'Wandoos Speed',
        WISH: 'Wish Speed',
        XBAR: 'Res3 Bars',
        XCAP: 'Res3 Cap',
        XPOW: 'Res3 Power',
        YGG: 'Yggdrasil Yield'
}

const ITEMLIST = [
        new Item('A Stick', Slot.W, 1, 100, [
                [Stat.P, 6]
        ]),
        new Item('Cloth Hat', Slot.H, 1, 100, [
                [Stat.T, 2]
        ])
];

const ITEMS = new ItemContainer(ITEMLIST.map((item, index) => {
        return [item.name, item];
}));

const EQUIP = new ItemContainer(ITEMLIST.map((item, index) => {
        return [item.slot, undefined];
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
                                const item = state.items[action.payload.name];
                                const slot = item.slot;
                                return {
                                        ...state,
                                        equip: {
                                                ...state.equip,
                                                [slot]: undefined
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
