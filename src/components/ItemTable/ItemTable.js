import React from 'react';

import Item from '../Item/Item'
import {TotalItem, Stat, Slot} from '../../assets/ItemAux'
import './ItemTable.css';
import {pareto, format_number, knapsack} from '../../util'

function compare_factory(key) {
        return function(prop) {
                return function(a, b) {
                        a = prop[a];
                        b = prop[b];
                        if (a === undefined || a[key] === undefined || b === undefined || b[key] === undefined) {
                                return true;
                        }
                        if (a[key][1] !== b[key][1]) {
                                return a[key][1] - b[key][1];
                        }
                        return a.slot[1] - b.slot[1];
                }
        }
}

function group(a, b, g) {
        if (a === undefined || b === undefined) {
                return false;
        }
        return a[g][1] !== b[g][1];
}

function add_equip(equip, item) {
        for (let i = 0; i < item.statnames.length; i++) {
                const stat = item.statnames[i];
                if (stat === Stat.RESPAWN) {
                        equip[stat] -= item[stat];
                } else {
                        equip[stat] += item[stat];
                }
        }
        equip.items.push(item);
        return equip;
}

const cart_aux = (a, b) => [].concat(...a.map(d => b.map(e => [].concat(d, e))));
const cartesian = (a, b, ...c) => (
        b
        ? cartesian(cart_aux(a, b), ...c)
        : a);

const outfits = (options) => {
        let tmp = cartesian(...options).map((items) => {
                let equip = new TotalItem();
                for (let i = 0; i < items.length; i++) {
                        add_equip(equip, items[i]);
                }
                return equip;
        })
        return tmp;
};

export function score_product(equip, stats) {
        let score = 1;
        for (let idx in stats) {
                let stat = stats[idx];
                score *= equip[stat] / 100;
        }
        return score;
}

export const Factors = {
        ENGU: [
                Stat.ENERGY_CAP, Stat.ENERGY_POWER, Stat.NGU_SPEED
        ],
        MNGU: [
                Stat.MAGIC_CAP, Stat.MAGIC_POWER, Stat.NGU_SPEED
        ],
        NGUS: [
                Stat.ENERGY_CAP,
                Stat.ENERGY_POWER,
                Stat.NGU_SPEED,
                Stat.MAGIC_CAP,
                Stat.MAGIC_POWER,
                Stat.NGU_SPEED
        ],
        HACK: [
                Stat.RES3_CAP, Stat.RES3_POWER, Stat.HACK_SPEED
        ],
        NGUSHACK: [
                Stat.ENERGY_CAP,
                Stat.ENERGY_POWER,
                Stat.NGU_SPEED,
                Stat.MAGIC_CAP,
                Stat.MAGIC_POWER,
                Stat.NGU_SPEED,
                Stat.RES3_CAP,
                Stat.RES3_POWER,
                Stat.HACK_SPEED
        ],
        RESPAWN: [Stat.RESPAWN]
}

function gear_slot(names, list, type) {
        return names.filter((name) => {
                if (list[name].empty) {
                        return false;
                }
                return list[name].slot[0] === type[0];
        }).map((name) => (list[name])).filter((item) => (!item.disable));
}

export default class ItemTable extends React.Component {
        render() {
                //TODO: sorting on every change seems very inefficient
                let buffer = [];
                let sorted;
                {
                        let compare = compare_factory(this.props.group)(this.props[this.props.type]);
                        let class_idx = 0;
                        sorted = [...this.props[this.props.type].names].sort(compare);
                        let localbuffer = [];
                        let last = undefined;
                        for (let idx = 0; idx < sorted.length; idx++) {
                                let name = sorted[idx];
                                const item = this.props[this.props.type][name];
                                let next = group(last, item, this.props.group);
                                if (next) {
                                        buffer.push(<div className='item-section' key={class_idx}>
                                                <span>{last[this.props.group][0]}<br/></span>{localbuffer}
                                        </div>);
                                        class_idx++;
                                        localbuffer = [];
                                }
                                localbuffer.push(<Item item={item} handleClickItem={this.props.handleClickItem} handleDoubleClickItem={this.props.handleDoubleClickItem} key={name}/>);
                                last = item;
                        }
                        buffer.push(<div className='item-section' key={class_idx}>
                                <span>{last[this.props.group][0]}<br/></span>{localbuffer}
                        </div>);
                }
                if (this.props.type === 'equip') {
                        let equip = new TotalItem();
                        for (let idx = 0; idx < sorted.length; idx++) {
                                const name = sorted[idx];
                                const item = this.props[this.props.type][name];
                                add_equip(equip, item);
                        }
                        buffer.push(<p key='stats'>
                                Energy NGU: {format_number(score_product(equip, Factors.ENGU))}x<br/>
                                Magic NGU: {format_number(score_product(equip, Factors.MNGU))}x<br/>
                                Hack: {format_number(score_product(equip, Factors.HACK))}x<br/>
                                EM NGU * Hack: {format_number(score_product(equip, Factors.NGUSHACK))}x<br/>
                                Respawn: {format_number(score_product(equip, Factors.RESPAWN))}x<br/>
                        </p>);
                } else {
                        let options = Object.getOwnPropertyNames(Slot).filter((x) => (x !== 'ACCESSORY'))
                        options = options.map((x) => (gear_slot(sorted, this.props[this.props.type], Slot[x])))
                        let factor = Factors.NGUSHACK;
                        let remaining = options.map((x) => (pareto(x, factor)));
                        console.log(options);
                        console.log(remaining);
                        if (remaining.map((x) => (x.length)).reduce((a, b) => (a * b)) > 5000) {
                                console.log('Too many options (' + remaining.map((x) => (x.length)).reduce((a, b) => (a * b)) + '), sorry!', remaining)
                        } else {
                                let bases = outfits(remaining);
                                let optimal = new TotalItem();
                                console.log(bases.length);
                                bases = pareto(bases, factor);
                                console.log(bases.length);
                                for (let idx in bases) {
                                        let accs = gear_slot(sorted, this.props[this.props.type], Slot.ACCESSORY);
                                        let candidate = knapsack(accs, 12, bases[idx], (a) => (1), add_equip, (x) => (score_product(x, factor)));
                                        if (score_product(optimal, factor) < score_product(candidate, factor)) {
                                                optimal = candidate;
                                        }
                                }
                                console.log(optimal);
                        }
                }
                return (<div className='item-table'>
                        {buffer}
                </div>);
        }
}
