import {LOCALSTORAGE_NAME} from '../constants';
import {ITEMLIST} from '../assets/Items'
import {
        ItemContainer,
        ItemNameContainer,
        Slot,
        EmptySlot,
        update_level,
        SetName
} from '../assets/ItemAux'
import {clone} from '../util'

import {AUGMENT, AUGMENT_SETTINGS} from '../actions/Augment';
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
import {DELETE_SLOT} from '../actions/DeleteSlot'
import {LOAD_SLOT} from '../actions/LoadSlot'
import {SAVE_SLOT} from '../actions/SaveSlot'
import {TOGGLE_SAVED} from '../actions/ToggleSaved'
import {LOAD_STATE_LOCALSTORAGE} from '../actions/LoadStateLocalStorage';
import {SAVE_STATE_LOCALSTORAGE} from '../actions/SaveStateLocalStorage';

let ITEMS = new ItemContainer(ITEMLIST.map((item, index) => {
        return [item.name, item];
}));

const accslots = 12;
const offhand = 0;
const maxZone = 28;
const zoneDict = {};
Object.getOwnPropertyNames(SetName).forEach(x => {
        zoneDict[SetName[x][1]] = 0 < SetName[x][1] && SetName[x][1] < maxZone;
});

const INITIAL_STATE = {
        itemdata: ITEMS,
        items: ITEMS.names,
        offhand: offhand,
        equip: ItemNameContainer(accslots, offhand),
        lastequip: ItemNameContainer(accslots, offhand),
        savedequip: [ItemNameContainer(accslots, offhand)],
        savedidx: 0,
        maxsavedidx: 0,
        showsaved: false,
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
        looty: 4,
        pendant: 6,
        titanversion: 1,
        hidden: zoneDict,
        augment: {
                lsc: 20,
                time: 1440,
                vals: []
        },
        version: '1.1.0'
};

const ItemsReducer = (state = INITIAL_STATE, action) => {
        switch (action.type) {
                case AUGMENT:
                        {
                                if (!state.running) {
                                        return state;
                                }
                                console.log('worker finished')
                                return {
                                        ...state,
                                        augment: {
                                                ...state.augment,
                                                vals: action.payload.vals
                                        },
                                        running: false
                                };
                        }

                case AUGMENT_SETTINGS:
                        {
                                let lsc = Number(action.payload.lsc);
                                let time = Number(action.payload.time);
                                if (isNaN(lsc)) {
                                        lsc = 20;
                                }
                                if (isNaN(time)) {
                                        time = 1440;
                                }
                                return {
                                        ...state,
                                        augment: {
                                                ...state.augment,
                                                lsc: lsc,
                                                time: time
                                        }
                                };
                        }

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
                                                return {
                                                        ...state,
                                                        equip: {
                                                                ...state.equip,
                                                                accessory: state.equip.accessory.slice(0, -1)
                                                        },
                                                        lastequip: state.equip,
                                                        maxslots: state.maxslots.map((val, index) => {
                                                                if (0 < val && val === state.equip.accessory.length) {
                                                                        return val + action.payload.val;
                                                                }
                                                                return val;
                                                        })
                                                }
                                        }
                                        if (action.payload.val === 1) {
                                                return {
                                                        ...state,
                                                        equip: {
                                                                ...equip,
                                                                accessory: state.equip.accessory.concat([new EmptySlot(slot).name])
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
                                const name = action.payload.name;
                                const item = state.itemdata[name];
                                return {
                                        ...state,
                                        itemdata: {
                                                ...state.itemdata,
                                                [name]: {
                                                        ...item,
                                                        disable: !item.disable
                                                }
                                        }
                                };
                        }

                case TOGGLE_EDIT:
                        {
                                const name = action.payload.name;
                                const item = state.itemdata[name];
                                return {
                                        ...state,
                                        editItem: [
                                                action.payload.on, name, item === undefined
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
                                let item = state.itemdata[state.editItem[1]];
                                update_level(item, action.payload.val);
                                return {
                                        ...state,
                                        editItem: {
                                                ...state.editItem,
                                                2: action.payload.val
                                        },
                                        itemdata: {
                                                ...state.itemdata,
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
                                const name = action.payload.name;
                                const slot = state.itemdata[name].slot[0];
                                const count = state.equip[slot].length;
                                let sel = count - 1;
                                for (let idx = 0; idx < count; idx++) {
                                        if (state.itemdata[state.equip[slot][idx]].empty) {
                                                if (sel > idx) {
                                                        sel = idx;
                                                }
                                        }
                                        if (state.equip[slot][idx] === name) {
                                                return state;
                                        }
                                }
                                return {
                                        ...state,
                                        equip: {
                                                ...state.equip,
                                                [slot]: state.equip[slot].map((tmp, idx) => {
                                                        if (idx === sel) {
                                                                return name;
                                                        }
                                                        return tmp;
                                                })
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
                                let accslots = state.lastequip.accessory.length;
                                return {
                                        ...state,
                                        equip: state.lastequip,
                                        maxslots: state.maxslots.map((val, index) => {
                                                if (val > accslots) {
                                                        return accslots;
                                                }
                                                return val;
                                        }),
                                        lastequip: state.equip
                                }
                        }

                case UNEQUIP_ITEM:
                        {
                                const name = action.payload.name;
                                if (state.itemdata[name].empty) {
                                        return state;
                                }
                                const item = state.itemdata[name];
                                const slot = item.slot[0];
                                let sel = 0;
                                for (;; sel++) {
                                        if (state.equip[slot][sel] === name) {
                                                break;
                                        }
                                }
                                return {
                                        ...state,
                                        equip: {
                                                ...state.equip,
                                                [slot]: state.equip[slot].map((tmp, idx) => {
                                                        if (idx === sel) {
                                                                return new EmptySlot(item.slot).name;
                                                        }
                                                        return tmp;
                                                })
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
                                const equip = action.payload.equip;
                                const accslots = equip.accessory.length;
                                return {
                                        ...state,
                                        equip: equip,
                                        maxslots: state.maxslots.map((val, index) => {
                                                if (val > accslots) {
                                                        return accslots;
                                                }
                                                return val;
                                        }),
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
                                console.log('terminated worker');
                                return {
                                        ...state,
                                        running: false
                                }
                        }

                case SAVE_SLOT:
                        {
                                if (state.savedidx === state.maxsavedidx) {
                                        return {
                                                ...state,
                                                savedequip: state.savedequip.map((tmp, idx) => {
                                                        if (idx === state.savedidx) {
                                                                return state.equip;
                                                        }
                                                        return tmp;
                                                }).concat([ItemNameContainer(state.equip.accessory.length, state.offhand)]),
                                                maxsavedidx: state.maxsavedidx + 1
                                        }
                                }
                                return {
                                        ...state,
                                        savedequip: state.savedequip.map((tmp, idx) => {
                                                if (idx === state.savedidx) {
                                                        return state.equip;
                                                }
                                                return tmp;
                                        })
                                }
                        }

                case LOAD_SLOT:
                        {
                                const save = state.savedequip[state.savedidx];
                                let accslots = save.accessory.length;
                                return {
                                        ...state,
                                        equip: save,
                                        maxslots: state.maxslots.map((val, index) => {
                                                if (val > accslots) {
                                                        return accslots;
                                                }
                                                return val;
                                        })
                                }
                        }

                case DELETE_SLOT:
                        {
                                if (state.savedidx === state.savedequip.length - 1) {
                                        return state;
                                }
                                return {
                                        ...state,
                                        savedequip: state.savedequip.map((equip, index) => {
                                                if (index === state.maxsavedidx) {
                                                        return undefined;
                                                }
                                                if (index >= state.savedidx) {
                                                        return state.savedequip[index + 1];
                                                }
                                                return equip;
                                        }).filter(x => x !== undefined),
                                        savedidx: state.savedidx - (
                                                state.savedidx === state.maxsavedidx
                                                ? 1
                                                : 0),
                                        maxsavedidx: state.maxsavedidx - 1
                                }
                        }

                case TOGGLE_SAVED:
                        {
                                return {
                                        ...state,
                                        showsaved: !state.showsaved
                                };
                        }

                case SAVE_STATE_LOCALSTORAGE:
                        {
                                if (document.cookie.includes('accepts-cookies=true')) {
                                        window.localStorage.setItem(LOCALSTORAGE_NAME, JSON.stringify(action.payload.state));
                                }
                                return state;
                        }

                case LOAD_STATE_LOCALSTORAGE:
                        {
                                const lc = window.localStorage.getItem(LOCALSTORAGE_NAME);
                                let localStorageState = JSON.parse(lc);
                                if (!Boolean(localStorageState)) {
                                        console.log('No local storage found. Loading fresh v' + state.version + ' state.');
                                        return state;
                                }
                                if (!Boolean(localStorageState.version)) {
                                        console.log('No valid version information found. Loading fresh v' + state.version + ' state.');
                                        return state;
                                }
                                // TODO: Validate local storage state.
                                if (localStorageState.version !== state.version) {
                                        console.log('Saved local storage is v' + localStorageState.version + ', incompatible with current version. Loading fresh v' + state.version + ' state.');
                                        return state;
                                }
                                console.log('Loading saved v' + state.version + ' state.');
                                // update item store with changed levels and disabled items
                                for (let idx = 0; idx < localStorageState.items.length; idx++) {
                                        const name = localStorageState.items[idx];
                                        const saveditem = localStorageState.itemdata[name];
                                        let item = state.itemdata[name];
                                        item.disable = saveditem.disable;
                                        update_level(item, saveditem.level);
                                }
                                Object.getOwnPropertyNames(state).forEach(name => {
                                        if (localStorageState[name] === undefined) {
                                                localStorageState[name] = state[name];
                                                console.log('Keeping default ' + name + ': ' + state[name]);
                                        }
                                });
                                return {
                                        ...state,
                                        items: localStorageState.items,
                                        equip: localStorageState.equip,
                                        savedequip: localStorageState.savedequip,
                                        savedidx: localStorageState.savedidx,
                                        maxsavedidx: localStorageState.maxsavedidx,
                                        showsaved: localStorageState.showsaved,
                                        factors: localStorageState.factors,
                                        maxslots: localStorageState.maxslots,
                                        zone: localStorageState.zone,
                                        titanversion: localStorageState.titanversion,
                                        looty: localStorageState.looty,
                                        pendant: localStorageState.pendant,
                                        hidden: localStorageState.hidden,
                                        augment: localStorageState.augment
                                };
                        }

                default:
                        {
                                return state;
                        }
        }
};

export default ItemsReducer;
