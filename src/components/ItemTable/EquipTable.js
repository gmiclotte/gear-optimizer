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

export default class EquipTable extends React.Component {
        componentDidUpdate() {
                ReactTooltip.rebuild();
        }

        render() {
                //TODO: sorting on every change seems very inefficient
                let buffer = [];
                let sorted;
                let class_idx = 0;
                {
                        let compare = compare_factory(this.props.group)(this.props[this.props.type]);
                        sorted = [...this.props[this.props.type].names].sort(compare);
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
                                localbuffer.push(<Item item={item} handleClickItem={this.props.handleClickItem} handleRightClickItem={this.props.handleRightClickItem} handleDoubleClickItem={this.props.handleDoubleClickItem} key={name}/>);
                                last = item;
                        }
                        buffer.push(<div className='item-section' key={class_idx++}>
                                <span>Accessories<br/></span>{localbuffer}
                        </div>);
                } {
                        let equip = new Equip();
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
                                Respawn: {format_number(score_product(equip, Factors.RESPAWN) * 100, 0)}% reduction<br/>
                        </p>);
                } {
                        sorted = this.props.items.names.filter((name) => (this.props.items[name].level !== 100));
                        let localbuffer = [];
                        for (let idx = 0; idx < sorted.length; idx++) {
                                let name = sorted[idx];
                                const item = this.props.items[name];
                                localbuffer.push(<Item item={item} handleClickItem={() => (undefined)} handleRightClickItem={this.props.handleRightClickItem} handleDoubleClickItem={() => (undefined)} key={name}/>);
                        }
                        if (localbuffer.length > 0) {
                                buffer.push(<div className='item-section' key={class_idx++}>
                                        <span>Not maxed<br/></span>{localbuffer}
                                </div>);
                        }
                }
                return (<div className='item-table'>
                        {buffer}
                </div>);
        }
}
