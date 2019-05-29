import {LOCALSTORAGE_NAME} from '../constants';
import {ITEMLIST} from '../assets/Items'
import {Equip, Slot, EmptySlot, Factors, update_level} from '../assets/ItemAux'
import {clone, compute_optimal} from '../util'

import {CREMENT} from '../actions/Crement'
import {DISABLE_ITEM} from '../actions/DisableItem';
import {TOGGLE_EDIT} from '../actions/ToggleEdit';
import {EDIT_ITEM} from '../actions/EditItem';
import {EDIT_FACTOR} from '../actions/EditFactor';
import {EQUIP_ITEM} from '../actions/EquipItem';
import {OPTIMIZE_GEAR} from '../actions/OptimizeGear';
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

const slotlist = (accslots) => {
        let list = Object.getOwnPropertyNames(Slot).map((x) => ([
                Slot[x][0] + 0,
                new EmptySlot(Slot[x])
        ])).filter((x) => (x[0] !== Slot.ACCESSORY[0] + 0));
        let slot = Slot.ACCESSORY
        for (let jdx = 0; jdx < accslots; jdx++) {
                list.push([
                        slot[0] + jdx,
                        new EmptySlot(slot)
                ]);
        }
        return list;
}

const accslots = 12;

const EQUIP = new ItemContainer(slotlist(accslots));

const INITIAL_STATE = {
        items: ITEMS,
        equip: EQUIP,
        loadouts: [],
        accslots: accslots,
        respawn: 1,
        daycare: 1,
        factors: [
                Factors.RESPAWN, Factors.DAYCARE_SPEED, Factors.HACK, Factors.NGUS, Factors.NGUSHACK
        ],
        editItem: [false, undefined, undefined]
};

const ItemsReducer = (state = INITIAL_STATE, action) => {
        switch (action.type) {
                case CREMENT:
                        {
                                if (action.payload.val < 0 && action.payload.min === state[action.payload.name]) {
                                        return state;
                                }
                                if (action.payload.val > 0 && action.payload.max === state[action.payload.name]) {
                                        return state;
                                }
                                if (action.payload.name === 'accslots') {
                                        let slot = Slot.ACCESSORY;
                                        let equip = clone(state.equip);
                                        if (action.payload.val === -1) {
                                                delete equip[slot[0] + (state[action.payload.name] - 1)];
                                                equip.names.pop();
                                                return {
                                                        ...state,
                                                        [action.payload.name]: state[action.payload.name] + action.payload.val,
                                                        equip: equip
                                                }
                                        }
                                        if (action.payload.val === 1) {
                                                let names = clone(state.equip.names);
                                                names.push(slot[0] + state[action.payload.name]);
                                                return {
                                                        ...state,
                                                        [action.payload.name]: state[action.payload.name] + action.payload.val,
                                                        equip: {
                                                                ...equip,
                                                                names: names,
                                                                [slot[0] + state[action.payload.name]]: new EmptySlot(slot)
                                                        }
                                                }
                                        }
                                }
                                return {
                                        ...state,
                                        [action.payload.name]: state[action.payload.name] + action.payload.val
                                }
                        }

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

                case TOGGLE_EDIT:
                        {
                                let item = state.items[action.payload.name];
                                return {
                                        ...state,
                                        editItem: [
                                                action.payload.on, action.payload.name, item === undefined
                                                        ? undefined
                                                        : item.level
                                        ]
                                };
                        }

                case EDIT_ITEM:
                        {
                                if (isNaN(action.payload.val)) {
                                        return state;
                                }
                                if (0 > action.payload.val || action.payload.val > 100) {
                                        return state;
                                }
                                let item = state.items[state.editItem[1]];
                                update_level(item, action.payload.val);
                                return {
                                        ...state,
                                        editItem: {
                                                ...state.editItem,
                                                2: action.payload.val
                                        },
                                        items: {
                                                ...state.items,
                                                [item.name]: item
                                        }
                                }
                        }

                case EDIT_FACTOR:
                        {
                                let f = Object.getOwnPropertyNames(Factors).filter((x) => (Factors[x][0] === action.payload.name))[0];
                                return {
                                        ...state,
                                        factors: state.factors.map((item, index) => {
                                                if (index === action.payload.idx) {
                                                        return Factors[f];
                                                }
                                                return item;
                                        })
                                };
                        }

                case EQUIP_ITEM:
                        {
                                let item = state.items[action.payload.name];
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
                                                [slot + sel]: {
                                                        ...item,
                                                        disable: false
                                                }
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

                case OPTIMIZE_GEAR:
                        {
                                let base_layout = [new Equip()];
                                for (let idx = 0; idx < state.factors.length; idx++) {
                                        let factor = state.factors[idx][1];
                                        let maxslots = state.accslots;
                                        if (state.factors[idx] === Factors.RESPAWN) {
                                                maxslots = state.respawn;
                                        }
                                        if (state.factors[idx] === Factors.DAYCARE_SPEED) {
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
                                const localStorageState = JSON.parse(lc);
                                if (localStorageState) {
                                        // TODO: Validate local storage state.
                                        return {
                                                ...state,
                                                items: localStorageState.items,
                                                equip: localStorageState.equip,
                                                accslots: localStorageState.accslots,
                                                respawn: localStorageState.respawn
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
