import {LOCALSTORAGE_NAME} from '../constants';
import {ITEMLIST} from '../assets/Items'
import {
        ItemContainer,
        ItemNameContainer,
        Slot,
        EmptySlot,
        update_level,
        SetName,
        Factors,
        Hacks
} from '../assets/ItemAux'

import {AUGMENT, AUGMENT_SETTINGS} from '../actions/Augment';
import {HACK, HACK_SETTINGS} from '../actions/Hack';
import {WISH, WISH_SETTINGS} from '../actions/Wish';
import {CREMENT} from '../actions/Crement'
import {DISABLE_ITEM} from '../actions/DisableItem';
import {TOGGLE_EDIT} from '../actions/ToggleEdit';
import {EDIT_ITEM} from '../actions/EditItem';
import {EDIT_FACTOR} from '../actions/EditFactor';
import {EQUIP_ITEM} from '../actions/EquipItem';
import {HIDE_ZONE} from '../actions/HideZone';
import {LOCK_ITEM} from '../actions/LockItem'
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

let ITEMS = new ItemContainer(ITEMLIST.map((item, idx) => {
        return [item.name, item];
}));

const accslots = 12;
const offhand = 0;
const maxZone = 28;
const zoneDict = {};
Object.getOwnPropertyNames(SetName).forEach(x => {
        zoneDict[SetName[x][1]] = 0 < SetName[x][1] && SetName[x][1] < maxZone;
});

function cleanState(state) {
        // clean locks
        Object.getOwnPropertyNames(state.locked).forEach(slot => {
                state.locked[slot] = state.locked[slot].filter(idx => {
                        if (idx >= state.equip[slot].length) {
                                return false;
                        }
                        return !state.itemdata[state.equip[slot][idx]].empty;
                });
        });
        // clean maxslots
        state.maxslots = state.maxslots.map((val, idx) => {
                if (val >= state.equip.accessory.length) {
                        return state.equip.accessory.length;
                }
                return val;
        })
        // clean offhand
        let offhand = state.offhand;
        if (offhand === 0 && state.equip.weapon.length > 1) {
                state.equip.weapon = [state.equip.weapon[0]];
        } else if (offhand > 0 && state.equip.weapon.length < 2) {
                state.equip.weapon = [
                        state.equip.weapon[0],
                        new EmptySlot(Slot['WEAPON']).name
                ];
        }
        // return cleaned state
        return state;
}

const INITIAL_STATE = {
        itemdata: ITEMS,
        items: ITEMS.names,
        offhand: offhand,
        equip: ItemNameContainer(accslots, offhand),
        locked: {},
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
                false, undefined, undefined, undefined
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
        wishstats: {
                epow: 1,
                ecap: 1,
                mpow: 1,
                mcap: 1,
                rpow: 1,
                rcap: 1,
                wishspeed: 1,
                wishcap: 4 * 60,
                wishtime: 4 * 60,
                wishidx: 0,
                start: 0,
                goal: 1,
                wishes: [
                        {
                                wishidx: 0,
                                start: 0,
                                goal: 1
                        }, {
                                wishidx: 1,
                                start: 0,
                                goal: 1
                        }, {
                                wishidx: 2,
                                start: 0,
                                goal: 1
                        }, {
                                wishidx: 3,
                                start: 0,
                                goal: 1
                        }
                ],
                rp_idx: 0
        },
        hackstats: {
                rbeta: 0,
                rdelta: 0,
                rpow: 1,
                rcap: 1,
                hackspeed: 1,
                hacktime: 24 * 60,
                hacks: Hacks.map(hack => {
                        return {level: 0, reducer: 0, goal: 1};
                })
        },
        version: '1.2.0'
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

                case HACK:
                        {
                                if (!state.running) {
                                        return state;
                                }
                                console.log('worker finished')
                                return {
                                        ...state,
                                        running: false
                                };
                        }

                case HACK_SETTINGS:
                        {
                                return {
                                        ...state,
                                        hackstats: {
                                                ...action.payload.hackstats
                                        }
                                };
                        }

                case WISH:
                        {
                                if (!state.running) {
                                        return state;
                                }
                                console.log('worker finished')
                                return {
                                        ...state,
                                        running: false
                                };
                        }

                case WISH_SETTINGS:
                        {
                                return {
                                        ...state,
                                        wishstats: {
                                                ...action.payload.wishstats
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
                                if (action.payload.name === 'wishslots') {
                                        let wishes = [...state.wishstats.wishes];
                                        if (action.payload.val === -1) {
                                                if (wishes.length === 1) {
                                                        return state;
                                                }
                                                wishes.pop();
                                        } else if (action.payload.val === 1) {
                                                wishes.push({wishidx: 0, start: 0, goal: 1});
                                        }
                                        return {
                                                ...state,
                                                wishstats: {
                                                        ...state.wishstats,
                                                        wishes: wishes
                                                }
                                        };
                                }
                                if (action.payload.name === 'accslots') {
                                        let accessory;
                                        if (action.payload.val === -1) {
                                                accessory = state.equip.accessory.slice(0, -1);
                                        } else if (action.payload.val === 1) {
                                                accessory = state.equip.accessory.concat([new EmptySlot(Slot.ACCESSORY).name]);
                                        }
                                        return cleanState({
                                                ...state,
                                                equip: {
                                                        ...state.equip,
                                                        accessory: accessory
                                                },
                                                lastequip: state.equip
                                        });
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
                                                [name]: state.maxslots.map((val, idx) => {
                                                        if (idx === changed) {
                                                                return val + change;
                                                        }
                                                        return val;
                                                })
                                        }
                                }
                                return cleanState({
                                        ...state,
                                        [action.payload.name]: state[action.payload.name] + action.payload.val
                                });
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
                                                        : item.level,
                                                action.payload.lockable
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

                case LOCK_ITEM:
                        {
                                const lock = action.payload.lock;
                                const slot = action.payload.slot;
                                const idx = action.payload.idx;
                                let tmp = state.locked[slot];
                                if (tmp === undefined) {
                                        tmp = [];
                                }
                                if (lock) {
                                        if (!tmp.includes(idx)) {
                                                tmp.push(idx);
                                        }
                                } else {
                                        tmp = tmp.filter(i => i !== idx);
                                }
                                return {
                                        ...state,
                                        locked: {
                                                ...state.locked,
                                                [slot]: tmp
                                        }
                                };
                        }

                case EDIT_FACTOR:
                        {
                                let factors = [];
                                let maxslots = [];
                                if (action.payload.name === 'INSERT') {
                                        state.factors.forEach((item, idx) => {
                                                if (idx === action.payload.idx) {
                                                        factors.push('NONE');
                                                        maxslots.push(state.equip.accessory.length);
                                                }
                                                factors.push(item);
                                                maxslots.push(state.maxslots[idx]);
                                        });
                                } else {
                                        factors = state.factors.map((item, idx) => {
                                                if (idx === action.payload.idx) {
                                                        return action.payload.name;
                                                }
                                                return item;
                                        });
                                        maxslots = state.maxslots;
                                }
                                // clean factors
                                let tmpFactors = [];
                                let tmpMaxslots = [];
                                for (let i = 0; i < factors.length; i++) {
                                        if (factors[i] !== 'DELETE') {
                                                tmpFactors.push(factors[i]);
                                                tmpMaxslots.push(maxslots[i]);
                                        }
                                }
                                let i = tmpFactors.length - 1;
                                while (tmpFactors.length > 1 && tmpFactors[i - 1] === 'NONE' && tmpFactors[i] === 'NONE') {
                                        tmpFactors.pop();
                                        tmpMaxslots.pop();
                                        i--;
                                }
                                if (tmpFactors[tmpFactors.length - 1] !== 'NONE') {
                                        tmpFactors.push('NONE');
                                        tmpMaxslots.push(state.equip.accessory.length);
                                }
                                return {
                                        ...state,
                                        factors: tmpFactors,
                                        maxslots: tmpMaxslots
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
                                return cleanState({
                                        ...state,
                                        equip: state.lastequip,
                                        lastequip: state.equip
                                });
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
                                return cleanState({
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
                                });
                        }

                case OPTIMIZE_GEAR:
                        {
                                if (!state.running) {
                                        return state;
                                }
                                console.log('worker finished')
                                const equip = action.payload.equip;
                                return cleanState({
                                        ...state,
                                        equip: equip,
                                        lastequip: state.equip,
                                        running: false
                                });
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
                                                                return {
                                                                        ...state.equip
                                                                };
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
                                                        return {
                                                                ...state.equip
                                                        };
                                                }
                                                return tmp;
                                        })
                                }
                        }

                case LOAD_SLOT:
                        {
                                const save = state.savedequip[state.savedidx];
                                return cleanState({
                                        ...state,
                                        equip: {
                                                ...save
                                        }
                                });
                        }

                case DELETE_SLOT:
                        {
                                if (state.savedidx === state.savedequip.length - 1) {
                                        // do not delete the last slot
                                        return state;
                                }
                                return {
                                        ...state,
                                        savedequip: state.savedequip.map((equip, idx) => {
                                                if (idx === state.maxsavedidx) {
                                                        return undefined;
                                                }
                                                if (idx >= state.savedidx) {
                                                        return state.savedequip[idx + 1];
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
                                if (localStorageState.version === '1.0.0') {
                                        console.log('Saved local storage is v' + localStorageState.version + ', incompatible with current version. Loading fresh v' + state.version + ' state.');
                                        return state;
                                }
                                console.log('Loading saved v' + state.version + ' state.');
                                // update item store with changed levels and disabled items
                                for (let idx = 0; idx < localStorageState.items.length; idx++) {
                                        const name = localStorageState.items[idx];
                                        const saveditem = localStorageState.itemdata[name];
                                        let item = state.itemdata[name];
                                        if (item === undefined) {
                                                // item was renamed or removed
                                                console.log('Item ' + name + ' was renamed or removed, this may result in changes in saved or equipped loadouts.')
                                                const slot = saveditem.slot[0];
                                                localStorageState.equip[slot] = localStorageState.equip[slot].map(tmp => {
                                                        if (tmp === name) {
                                                                return new EmptySlot(saveditem.slot).name;
                                                        }
                                                        return tmp;
                                                });
                                                localStorageState.savedequip = localStorageState.savedequip.map(save => {
                                                        save[slot] = save[slot].map(tmp => {
                                                                if (tmp === name) {
                                                                        return new EmptySlot(saveditem.slot).name;
                                                                }
                                                                return tmp;
                                                        });
                                                        return save;
                                                })
                                                continue;
                                        }
                                        if (saveditem.empty) {
                                                continue;
                                        }
                                        item.disable = saveditem.disable;
                                        update_level(item, saveditem.level);
                                }
                                Object.getOwnPropertyNames(state).forEach(name => {
                                        if (name === 'version') {
                                                return;
                                        }
                                        if (localStorageState[name] === undefined) {
                                                localStorageState[name] = state[name];
                                                console.log('Keeping default ' + name + ': ' + state[name]);
                                        }
                                });
                                if (localStorageState.version === '1.1.0') {
                                        // update to 1.2.0
                                        console.log('Updating local storage for wishes, some wish data might be erased.');
                                        Object.getOwnPropertyNames(state.wishstats).forEach(name => {
                                                if (localStorageState.wishstats[name] === undefined) {
                                                        localStorageState.wishstats[name] = state.wishstats[name];
                                                        console.log('Keeping default wishstats ' + name + ': ' + state.wishstats[name]);
                                                }
                                        });
                                        Object.getOwnPropertyNames(localStorageState.wishstats).forEach(name => {
                                                if (state.wishstats[name] === undefined) {
                                                        console.log('Removing saved wishstats ' + name + ': ' + localStorageState.wishstats[name]);
                                                        delete localStorageState.wishstats[name];
                                                }
                                        });
                                        localStorageState.wishstats.wishes = localStorageState.wishstats.wishes.map(wish => {
                                                if (wish.start === undefined) {
                                                        wish.start = 0;
                                                }
                                                return wish;
                                        });
                                        console.log('Wish data:', localStorageState.wishstats);
                                }
                                if (localStorageState.version === '1.2.0') {
                                        console.log('Updating local storage for hacks, some hack data might be erased.');
                                        Object.getOwnPropertyNames(state.hackstats).forEach(name => {
                                                if (localStorageState.hackstats[name] === undefined) {
                                                        localStorageState.hackstats[name] = state.hackstats[name];
                                                        console.log('Keeping default hackstats ' + name + ': ' + state.hackstats[name]);
                                                }
                                        });
                                        Object.getOwnPropertyNames(localStorageState.hackstats).forEach(name => {
                                                if (state.hackstats[name] === undefined) {
                                                        console.log('Removing saved hackstats ' + name + ': ' + localStorageState.hackstats[name]);
                                                        delete localStorageState.hackstats[name];
                                                }
                                        });
                                        localStorageState.hackstats.hacks = localStorageState.hackstats.hacks.map(hack => {
                                                if (hack.start === undefined) {
                                                        hack.start = 0;
                                                }
                                                return hack;
                                        });
                                        console.log('Hack data:', localStorageState.hackstats);
                                }
                                const tmp_factors = Object.getOwnPropertyNames(Factors);
                                localStorageState.factors = localStorageState.factors.map(name => {
                                        if (!tmp_factors.includes(name)) {
                                                return 'NONE';
                                        }
                                        return name;
                                });
                                return {
                                        ...state,
                                        offhand: localStorageState.offhand,
                                        equip: localStorageState.equip,
                                        locked: localStorageState.locked,
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
                                        augment: localStorageState.augment,
                                        wishstats: localStorageState.wishstats
                                };
                        }

                default:
                        {
                                return state;
                        }
        }
};

export default ItemsReducer;
