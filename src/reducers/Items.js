import {LOCALSTORAGE_NAME} from '../constants';
import {ITEMLIST} from '../assets/Items'
import {
        ItemContainer,
        Slot,
        EmptySlot,
        update_level,
        slotlist,
        SetName
} from '../assets/ItemAux'
import {clone} from '../util'

import {CREMENT} from '../actions/Crement'
import {DISABLE_ITEM} from '../actions/DisableItem';
import {TOGGLE_EDIT} from '../actions/ToggleEdit';
import {EDIT_ITEM} from '../actions/EditItem';
import {EDIT_FACTOR} from '../actions/EditFactor';
import {EQUIP_ITEM} from '../actions/EquipItem';
import {HIDE_ZONE} from '../actions/HideZone';
import {OPTIMIZE_GEAR} from '../actions/OptimizeGear';
import {OPTIMIZING_GEAR} from '../actions/OptimizingGear';
import {TERMINATE} from '../actions/Terminate'
import {UNDO} from '../actions/Undo'
import {UNEQUIP_ITEM} from '../actions/UnequipItem';
import {LOAD_STATE_LOCALSTORAGE} from '../actions/LoadStateLocalStorage';
import {SAVE_STATE_LOCALSTORAGE} from '../actions/SaveStateLocalStorage';

let ITEMS = new ItemContainer(ITEMLIST.map((item, index) => {
        return [item.name, item];
}));

const accslots = 12;

const EQUIP = new ItemContainer(slotlist(accslots));

const maxZone = 28;
const zoneDict = {};
Object.getOwnPropertyNames(SetName).map(x => {
        zoneDict[SetName[x][1]] = 0 < SetName[x][1] && SetName[x][1] < maxZone;
});

const INITIAL_STATE = {
        items: ITEMS,
        equip: EQUIP,
        lastequip: EQUIP,
        loadouts: [],
        accslots: accslots,
        factors: [
                'RESPAWN', 'DAYCARE_SPEED', 'HACK', 'NGUS', 'NONE'
        ],
        maxslots: [
                3, 1, 6, accslots, accslots
        ],
        editItem: [
                false, undefined, undefined
        ],
        running: false,
        zone: maxZone,
        hidden: zoneDict
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
                                                        equip: equip,
                                                        lastequip: state.equip,
                                                        maxslots: state.maxslots.map((val, index) => {
                                                                if (val === state[action.payload.name]) {
                                                                        return val + action.payload.val;
                                                                }
                                                                return val;
                                                        })
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
                                if (action.payload.name[0] === 'maxslots') {
                                        let name = action.payload.name[0];
                                        let changed = action.payload.name[1];
                                        let change = action.payload.val;
                                        if (change < 0 && action.payload.min === state[name][changed]) {
                                                return state;
                                        }
                                        if (change > 0 && action.payload.max === state[name][changed]) {
                                                return state;
                                        }
                                        console.log(name, changed, change)
                                        return {
                                                ...state,
                                                [name]: state.maxslots.map((val, index) => {
                                                        if (index === changed) {
                                                                return val + change;
                                                        }
                                                        return val;
                                                })
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
                                        },
                                        lastequip: state.equip
                                };
                        }

                case HIDE_ZONE:
                        {
                                return {
                                        ...state,
                                        hidden: {
                                                ...state.hidden,
                                                [action.payload.idx]: !state.hidden[action.payload.idx]
                                        }
                                }
                        }
                case UNDO:
                        {
                                return {
                                        ...state,
                                        equip: state.lastequip,
                                        lastequip: state.equip
                                }
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
                                        },
                                        lastequip: state.equip
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
                                        lastequip: state.equip,
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
                                                lastequip: localStorageState.lastequip,
                                                accslots: localStorageState.accslots,
                                                factors: localStorageState.factors,
                                                maxslots: localStorageState.maxslots,
                                                zone: localStorageState.zone,
                                                hidden: localStorageState.hidden
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
