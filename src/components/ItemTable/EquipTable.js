import React from 'react';
import ReactTooltip from 'react-tooltip'

import Item from '../Item/Item'
import {Equip, Factors, EmptySlot, Slot} from '../../assets/ItemAux'
import './ItemTable.css';
import {format_number, score_product, add_equip} from '../../util'

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
        if (a[g] === undefined || b[g] === undefined) {
                return false;
        }
        return a[g][1] !== b[g][1];
}

class BonusLine extends React.Component {
        diffstyle(old, val) {
                let col = 'black';
                if (old < val) {
                        col = 'green';
                } else if (old > val) {
                        col = 'red';
                }
                let diffstyle = {
                        color: col
                };
                return diffstyle;
        }
        render() {
                let val = score_product(this.props.equip, this.props.factor[1]);
                let old = score_product(this.props.savedequip, this.props.factor[1]);
                let text = 'x';
                let diff_val;
                if (this.props.factor[0] === Factors.RESPAWN[0]) {
                        val *= 100;
                        old *= 100;
                        diff_val = val - old;
                        text = '% reduction';
                } else {
                        diff_val = 100 * (val / old - 1);
                }
                let diffstyle = this.diffstyle(old, val);
                text = this.props.factor[0] + ': ' + format_number(val) + text + ' (';
                let diff = <span style={diffstyle}>
                        {
                                (
                                        diff_val >= 0
                                        ? '+'
                                        : '') + format_number(diff_val) + (
                                        this.props.factor[0] === Factors.RESPAWN[0]
                                        ? 'pp'
                                        : '%')
                        }
                </span>;
                return (<> {
                        text
                } {
                        diff
                } {
                        ')'
                }<br/></>);
        }
}

export default class EquipTable extends React.Component {
        componentDidUpdate() {
                ReactTooltip.rebuild();
        }

        compute_equip(state) {
                let equip = new Equip();
                for (let idx = 0; idx < state.names.length; idx++) {
                        const name = state.names[idx];
                        const item = state[name];
                        add_equip(equip, item);
                }
                return equip;
        }

        render() {
                //TODO: sorting on every change seems very inefficient
                let buffer = [];
                let class_idx = 0;
                {
                        let compare = compare_factory(this.props.group)(this.props[this.props.type]);
                        let sorted = [...this.props.equip.names].sort(compare);
                        let localbuffer = [];
                        let last = new EmptySlot();
                        for (let idx = 0; idx < sorted.length; idx++) {
                                let name = sorted[idx];
                                const item = this.props[this.props.type][name];
                                let next = group(last, item, this.props.group);
                                if (next && item.slot[0] === Slot.ACCESSORY[0]) {
                                        buffer.push(<div className='item-section' key={class_idx++}>
                                                <span>Outfit<br/></span>{localbuffer}
                                        </div>);
                                        localbuffer = [];
                                }
                                localbuffer.push(<Item item={item} handleClickItem={this.props.handleClickItem} handleRightClickItem={this.props.handleRightClickItem} key={name}/>);
                                last = item;
                        }
                        buffer.push(<div className='item-section' key={class_idx++}>
                                <span>{'Accessories'}<br/></span>{localbuffer}
                        </div>);
                } {
                        let equip = this.compute_equip(this.props.equip)
                        let savedequip = this.compute_equip(this.props.savedequip[this.props.savedidx]);
                        buffer.push(<div className='item-section' key='stats'>{'Gear stats (change w.r.t. save slot)'}<br/><br/> {
                                        Object.getOwnPropertyNames(Factors).map((factor) => (
                                                factor === 'NONE'
                                                ? <div key={factor}/>
                                                : <BonusLine equip={equip} savedequip={savedequip} factor={Factors[factor]} key={factor}/>))
                                }
                        </div>);
                } {
                        let sorted = this.props.items.names.filter((name) => (this.props.items[name].level !== 100));
                        let localbuffer = [];
                        for (let idx = 0; idx < sorted.length; idx++) {
                                let name = sorted[idx];
                                const item = this.props.items[name];
                                localbuffer.push(<Item item={item} handleClickItem={this.props.handleRightClickItem} handleRightClickItem={this.props.handleRightClickItem} key={name}/>);
                        }
                        if (localbuffer.length > 0) {
                                buffer.push(<div className='item-section' key={class_idx++}>
                                        <span>{'Not maxed'}<br/></span>{localbuffer}
                                </div>);
                        }
                } {
                        let sorted = this.props.items.names.filter((name) => (this.props.items[name].disable));
                        let localbuffer = [];
                        for (let idx = 0; idx < sorted.length; idx++) {
                                let name = sorted[idx];
                                const item = this.props.items[name];
                                localbuffer.push(<Item item={item} handleClickItem={this.props.handleRightClickItem} handleRightClickItem={this.props.handleRightClickItem} key={name}/>);
                        }
                        if (localbuffer.length > 0) {
                                buffer.push(<div className='item-section' key={class_idx++}>
                                        <span>{'Disabled'}<br/></span>{localbuffer}
                                </div>);
                        }
                }
                return (<div className='item-table'>
                        {buffer}
                </div>);
        }
}
