import React from 'react';
import ReactTooltip from 'react-tooltip'

import Item from '../Item/Item'
import {Factors, EmptySlot, Slot} from '../../assets/ItemAux'
import './ItemTable.css';
import {score_equip, shorten, cubeBaseItemData} from '../../util'

import {default as SaveButtons} from './SaveButtons'

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

const formatted = (val, stat, d) => {
        if (val === Infinity) {
                return '(+∞%)';
        }
        let num = shorten(Math.abs(val));
        let pf = d
                ? (
                        val >= 0
                        ? '(+'
                        : '(-')
                : '';

        let sf = d
                ? '%)'
                : ''
        if (stat === 'Respawn') {
                sf = d
                        ? 'pp)'
                        : '% reduction';
        } else {
                pf = d
                        ? pf
                        : '×';
        }
        return pf + num + sf
};

class BonusLine extends React.Component {
        diffclass(old, val) {
                let className = 'same-stat';
                if (old < val) {
                        className = 'increase-stat';
                } else if (old > val) {
                        className = 'decrease-stat';
                }
                return className;
        }

        render() {
                let val = score_equip(this.props.itemdata, this.props.equip, this.props.factor, this.props.offhand, this.props.capstats);
                let old = score_equip(this.props.itemdata, this.props.savedequip, this.props.factor, this.props.offhand, this.props.capstats);
                let diff_val;
                let stat = this.props.factor[0];
                if (stat === 'Power' || stat === 'Toughness' || stat === 'Respawn') {
                        val *= 100;
                        old *= 100;
                }
                if (stat === 'Respawn') {
                        diff_val = val - old;
                } else {
                        diff_val = val === old
                                ? 0
                                : 100 * (val / old - 1);
                }
                let classNameDiff = this.diffclass(old, val);
                let diff = (<span className={classNameDiff}>
                        {formatted(diff_val, stat, true)}
                </span>);
                let className;
                for (let idx = 0; idx < this.props.factors.length; idx++) {
                        if (stat === Factors[this.props.factors[idx]][0]) {
                                className = ' priority-stat';
                                break;
                        }
                }
                let text = (<span className={className}>
                        {this.props.factor[0] + ': ' + formatted(val, stat, false) + ' '}
                        {diff}</span>);
                return (<> {
                        text
                }<br/></>);
        }
}

export default class EquipTable extends React.Component {
        constructor(props) {
                super(props);
                this.itemdata = cubeBaseItemData(props.itemdata, props.cubestats, props.basestats);
        }
        componentDidUpdate() {
                ReactTooltip.rebuild();
        }

        render_equip(equip, prefix, compare, buffer, handleClickItem, lockable) {
                this.itemdata = cubeBaseItemData(this.props.itemdata, this.props.cubestats, this.props.basestats);
                let sorted = Object.getOwnPropertyNames(Slot).sort((a, b) => Slot[a][1] - Slot[b][1]).reduce((res, slot) => res.concat(equip[Slot[slot][0]]), []);
                let localbuffer = [];
                let last = new EmptySlot();
                let typeIdx = 0;
                for (let idx = 0; idx < sorted.length; idx++) {
                        const name = sorted[idx];
                        const item = this.itemdata[name];
                        if (item === undefined) {
                                // fixes some bugs when loading new gear optimizer version
                                continue
                        }
                        if (item.slot === Slot.OTHER) {
                                continue;
                        }
                        const next = group(last, item, this.props.group);
                        if (next) {
                                typeIdx = idx;
                                if (item.slot[0] === Slot.ACCESSORY[0]) {
                                        buffer.push(<div className='item-section' key={this.class_idx++}>
                                                <span>{prefix + 'Outfit'}<br/></span>{localbuffer}
                                        </div>);
                                        localbuffer = [];
                                }
                        }
                        localbuffer.push(<Item item={item} idx={idx - typeIdx} lockable={lockable} locked={this.props.locked} handleClickItem={handleClickItem} handleRightClickItem={this.props.handleRightClickItem} key={name + idx}/>);
                        last = item;
                }
                buffer.push(<div className='item-section' key={this.class_idx++}>
                        <span>{prefix + 'Accessories'}<br/></span>{localbuffer}
                </div>);
        }

        render_conditional(condition, title, buffer) {
                let sorted = this.props.items.filter((name) => (condition(name) && this.itemdata[name].level !== undefined));
                let localbuffer = [];
                for (let idx = 0; idx < sorted.length; idx++) {
                        let name = sorted[idx];
                        const item = this.itemdata[name];
                        localbuffer.push(<Item item={item} handleClickItem={this.props.handleEquipItem} handleRightClickItem={this.props.handleRightClickItem} key={name}/>);
                }
                if (localbuffer.length > 0) {
                        buffer.push(<div className='item-section' key={this.class_idx++}>
                                <span>{title}<br/></span>{localbuffer}
                        </div>);
                }
        }

        render() {
                //TODO: sorting on every change is very inefficient
                let buffer = [];
                this.class_idx = 0;
                const compare = compare_factory(this.props.group)(this.itemdata);
                const equip = this.props.equip;
                const savedequip = this.props.savedequip[this.props.savedidx];
                this.render_equip(equip, '', compare, buffer, this.props.handleClickItem, true);
                buffer.push(<SaveButtons {...this.props} key='savebuttons'/>)
                if (this.props.showsaved) {
                        this.render_equip(savedequip, 'Saved ', compare, buffer, this.props.handleEquipItem, false);
                }
                buffer.push(<div className='item-section' key='stats'>{'Gear stats (change w.r.t. save slot)'}<br/><br/> {
                                Object.getOwnPropertyNames(Factors).map((factor) => (
                                        (factor === 'NONE' || factor === 'DELETE' || factor === 'INSERT')
                                        ? <div key={factor}/>
                                        : <BonusLine itemdata={this.itemdata} equip={equip} savedequip={savedequip} factor={Factors[factor]} factors={this.props.factors} capstats={this.props.capstats} offhand={this.props.offhand * 5} key={factor}/>))
                        }
                </div>);
                this.render_conditional(name => this.itemdata[name].level !== 100, 'Not maxed', buffer);
                this.render_conditional(name => this.itemdata[name].disable, 'Disabled', buffer);
                return (<div className='item-table'>
                        {buffer}
                </div>);
        }
}
