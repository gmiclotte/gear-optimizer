import {Slot, SetName} from './assets/ItemAux'
import {LOOTIES, PENDANTS} from './assets/Items'

export function clone(obj) {
        let copy;
        // Handle the 3 simple types, and null or undefined
        if (null == obj || "object" != typeof obj) 
                return obj;
        
        // Handle Date
        if (obj instanceof Date) {
                copy = new Date();
                copy.setTime(obj.getTime());
                return copy;
        }
        // Handle Array
        if (obj instanceof Array) {
                copy = [];
                for (let i = 0, len = obj.length; i < len; i++) {
                        copy[i] = clone(obj[i]);
                }
                return copy;
        }
        // Handle Object
        if (obj instanceof Object) {
                copy = {};
                for (let attr in obj) {
                        if (obj.hasOwnProperty(attr)) 
                                copy[attr] = clone(obj[attr]);
                        }
                return copy;
        }
        throw new Error("Unable to copy obj! Its type isn't supported.");
}

export function get_limits(state) {
        return {
                zone: state.zone,
                titan: get_max_titan(state.zone),
                titanversion: state.titanversion,
                looty: state.looty,
                pendant: state.pendant
        }
}

export function allowed_zone(itemdata, limits, name) {
        const zone = limits.zone;
        const titan = limits.titan;
        const titanversion = limits.titanversion;
        const looty = limits.looty;
        const pendant = limits.pendant;
        const item = itemdata[name];
        if (item.empty) {
                return false;
        }
        if (item.zone[1] > zone) {
                // zone too high
                return false;
        }
        if (item.zone[1] === titan[1] && item.zone[2] > titanversion) {
                // titan version too high
                return false;
        }
        if (item.zone[0] === SetName.LOOTY[0] && LOOTIES.indexOf(name) > looty) {
                return false;
        }
        if (item.zone[0] === SetName.FOREST_PENDANT[0] && PENDANTS.indexOf(name) > pendant) {
                return false;
        }
        return true;
}

export function get_zone(zone) {
        return SetName[Object.getOwnPropertyNames(SetName).filter(x => {
                        return zone === SetName[x][1];
                })[0]];
}

export function get_max_zone(zone) {
        let maxzone = 1;
        /* eslint-disable-next-line array-callback-return */
        Object.getOwnPropertyNames(SetName).map(x => {
                maxzone = SetName[x][1] > maxzone
                        ? SetName[x][1]
                        : maxzone;
        });
        return maxzone;
}

export function get_max_titan(zone) {
        let maxtitan = 21;
        /* eslint-disable-next-line array-callback-return */
        Object.getOwnPropertyNames(SetName).map(x => {
                if (SetName[x].length === 3 && SetName[x][1] <= zone) {
                        maxtitan = maxtitan[1] > SetName[x][1]
                                ? maxtitan
                                : SetName[x];
                }
        });
        return maxtitan;
}

export function score_equip(data, equip, stats) {
        const sorted = Object.getOwnPropertyNames(Slot).sort((a, b) => Slot[a][1] - Slot[b][1]).reduce((res, slot) => res.concat(equip[Slot[slot][0]]), []);
        let vals = [];
        for (let idx in stats) {
                const stat = stats[idx];
                if (stat === 'Respawn' || stat === 'Power' || stat === 'Toughness') {
                        vals[idx] = 0;
                } else {
                        vals[idx] = 100;
                }
                for (let jdx in sorted) {
                        const name = sorted[jdx];
                        const val = data[name][stat];
                        if (val === undefined) {
                                continue;
                        }
                        vals[idx] += val;
                }
        }
        return vals.reduce((res, val) => res * val / 100, 1);
}

export function score_product(equip, stats) {
        let score = 1;
        for (let idx in stats) {
                let stat = stats[idx];
                if (equip[stat] !== undefined) {
                        score *= equip[stat] / 100;
                }
        }
        return score;
}
