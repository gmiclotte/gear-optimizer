import {LOCALSTORAGE_NAME} from '../constants';
import {ITEMLIST} from '../assets/Items'
import {ItemContainer, Slot, EmptySlot, update_level, slotlist} from '../assets/ItemAux'
import {clone} from '../util'

import {CREMENT} from '../actions/Crement'
import {DISABLE_ITEM} from '../actions/DisableItem';
import {TOGGLE_EDIT} from '../actions/ToggleEdit';
import {EDIT_ITEM} from '../actions/EditItem';
import {EDIT_FACTOR} from '../actions/EditFactor';
import {EQUIP_ITEM} from '../actions/EquipItem';
import {OPTIMIZE_GEAR} from '../actions/OptimizeGear';
import {OPTIMIZING_GEAR} from '../actions/OptimizingGear';
import {TERMINATE} from '../actions/Terminate'
import {UNEQUIP_ITEM} from '../actions/UnequipItem';
import {LOAD_STATE_LOCALSTORAGE} from '../actions/LoadStateLocalStorage';
import {SAVE_STATE_LOCALSTORAGE} from '../actions/SaveStateLocalStorage';

let ITEMS = new ItemContainer(ITEMLIST.map((item, index) => {
        return [item.name, item];
}));

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
                'RESPAWN', 'DAYCARE_SPEED', 'HACK', 'NGUS', 'NGUSHACK'
        ],
        editItem: [
                false, undefined, undefined
        ],
        running: false
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
                                return {
                                        ...state,
                                        factors: state.factors.map((item, index) => {
                                                if (index === action.payload.idx) {
                                                        return action.payload.name;
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
                                if (!state.running) {
                                        return state;
                                }
                                console.log('worker finished')
                                return {
                                        ...state,
                                        equip: action.payload.equip,
                                        running: false
                                };
                        }

                case OPTIMIZING_GEAR:
                        {
                                if (state.running) {
                                        return state;
                                }
                                console.log('worker running');
                                return {
                                        ...state,
                                        running: true
                                };
                        }

                case TERMINATE:
                        {
                                console.log('terminated worker')
                                return {
                                        ...state,
                                        running: false
                                }
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
                                                respawn: localStorageState.respawn,
                                                daycare: localStorageState.daycare,
                                                factors: localStorageState.factors
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
