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

export const Slot = {
        W: 'Weapon',
        H: 'Head',
        C: 'Armor',
        P: 'Pants',
        B: 'Boots',
        A: 'Accessory'
}

export const Stat = {
        HACK_SPEED: 'Hack Speed',
        WISH_SPEED: 'Wish Speed',
        COOKING: 'Cooking',
        DAYCARE_SPEED: 'Daycare Speed',
        YGGDRASIL_YIELD: 'Yggdrasil Yield',
        MOVE_COOLDOWN: 'Move Cooldown',
        MAGIC_SPEED: 'Magic Speed',
        ENERGY_SPEED: 'Energy Speed',
        QUEST_DROP: 'Quest Drops',
        AP: 'AP',
        EXPERIENCE: 'Experience',
        RESPAWN: 'Respawn',
        GOLD_DROP: 'Gold Drops',
        P: 'Power',
        T: 'Toughness',
        ENERGY_POWER: 'Energy Power',
        ENERGY_BARS: 'Energy Bars',
        ENERGY_CAP: 'Energy Cap',
        MAGIC_POWER: 'Magic Power',
        MAGIC_BARS: 'Magic Bars',
        MAGIC_CAP: 'Magic Cap',
        NGU_SPEED: 'NGU Speed',
        WANDOOS_SPEED: 'Wandoos Speed',
        ADVANCE_TRAINING: 'Advance Training',
        AUGMENT_SPEED: 'Augment Speed',
        BEARD_SPEED: 'Beard Speed',
        SEED_DROP: 'Seed Gain',
        DROP_CHANCE: 'Drop Chance',
        RES3_POWER: 'Res3 Power',
        RES3_CAP: 'Res3 Cap',
        RES3_BARS: 'Res3 Bars'
}

const ITEMLIST = [
        new Item('A Stick', Slot.W, 1, 100, [
                [Stat.P, 6]
        ]),
        new Item('Cloth Hat', Slot.H, 1, 100, [
                [Stat.T, 2]
        ])
];

const ITEMS = new Map(ITEMLIST.map((item, index) => {
        return [item.name, item];
}));

const EQUIP = new Map(ITEMLIST.map((item, index) => {
        return [item.slot, undefined];
}));

const INITIAL_STATE = {
        items: ITEMS,
        equip: EQUIP
};

const ItemsReducer = (state = INITIAL_STATE, action) => {
        var equip;
        switch (action.type) {
                case EQUIP_ITEM:
                        {
                                console.log('equip item')
                                console.log(action.payload.name)
                                console.log(state)
                                const item = state.items.get(action.payload.name);
                                console.log(state.items.get(action.payload.name))
                                const slot = item.slot;
                                equip = new Map(state.equip)
                                console.log(equip)
                                equip.set(slot, item);
                                console.log(equip)
                                return {
                                        ...state,
                                        equip: equip
                                };
                        }
                case UNEQUIP_ITEM:
                        {
                                console.log('unequip item')
                                console.log(action.payload.name)
                                console.log(state)
                                const item = state.items.get(action.payload.name);
                                console.log(state.items.get(action.payload.name))
                                const slot = item.slot;
                                equip = new Map(state.equip)
                                console.log(equip)
                                equip.set(slot, undefined);
                                console.log(equip)
                                return {
                                        ...state,
                                        equip: equip
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
                                if (lc === 'undefined') {
                                        return state;
                                }
                                console.log('hello there')
                                console.log(lc, undefined)
                                const localStorageState = JSON.parse(lc);
                                console.log(localStorageState)
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
