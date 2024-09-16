import React from 'react';
import ReactTooltip from 'react-tooltip'

import {TargetItem} from '../Item/Item'
import {EmptySlot, Factors, Slot} from '../../assets/ItemAux'
import './ItemTable.css';
import {cubeBaseItemData, score_equip, shorten} from '../../util'

import {default as SaveButtons} from './SaveButtons'

function equip2url(equip, itemdata) {
    const base = window.location.href
    let url = base.substring(0, base.indexOf('#') + 1) + '/loadout/'
    let first = true
    Object.getOwnPropertyNames(Slot).forEach(slot => {
        if (slot === 'OTHER') {
            return;
        }
        equip[Slot[slot][0]].forEach(item => {
            if (itemdata[item].empty) {
                return;
            }
            if (!first) {
                url += '&'
            } else {
                first = false;
            }
            url += item;
        })
    });
    return encodeURI(url);
}

function compare_factory(key) {
    return function (prop) {
        return function (a, b) {
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
        let stat = this.props.factor[0];
        let className;
        let priority = false;
        for (let idx = 0; idx < this.props.factors.length; idx++) {
            if (stat === Factors[this.props.factors[idx]][0]) {
                className = ' priority-stat';
                priority = true;
                break;
            }
        }
        if (this.props.compactbonus && !priority) {
            return <></>;
        }
        let val = score_equip(this.props.itemdata, this.props.equip, this.props.factor, this.props.offhand, this.props.capstats);
        let old = score_equip(this.props.itemdata, this.props.savedequip, this.props.factor, this.props.offhand, this.props.capstats);
        let diff_val;
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
        this.state = {
            open: false
        };
        this.itemdata = cubeBaseItemData(props.itemdata, props.cubestats, props.basestats);
    }

    componentDidUpdate() {
        ReactTooltip.rebuild();
    }

    render_equip(equip, prefix, compare, buffer, handleClickItem, handleCtrlClickItem, handleShiftClickItem, lockable) {
        this.itemdata = cubeBaseItemData(this.props.itemdata, this.props.cubestats, this.props.basestats);
        let sorted = Object.getOwnPropertyNames(Slot).sort((a, b) => Slot[a][1] - Slot[b][1]).reduce((res, slot) => res.concat(equip[Slot[slot][0]]), []);
        let localbuffer = [];
        let last = new EmptySlot();
        let typeIdx = 0;
        for (let idx = 0; idx < sorted.length; idx++) {
            const id = sorted[idx];
            const item = this.itemdata[id];
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
            localbuffer.push(<TargetItem item={item} idx={idx - typeIdx} lockable={lockable} locked={this.props.locked}
                                         handleClickItem={handleClickItem} handleCtrlClickItem={handleCtrlClickItem}
                                         handleShiftClickItem={handleShiftClickItem}
                                         handleRightClickItem={(itemId) => this.props.handleRightClickItem(itemId, true)}
                                         handleDropItem={this.props.handleDropItem}
                                         key={id + '_' + idx}/>);
            last = item;
        }
        buffer.push(<div className='item-section' key={this.class_idx++}>
            <span>{prefix + 'Accessories'}<br/></span>{localbuffer}
        </div>);
    }

    render_conditional(condition, title, buffer, handleCtrlClickItem, handleShiftClickItem) {
        const short = 'hide' + title.toLowerCase().replace(/\s/g, '');
        let sorted = this.props.items.filter((id) => (condition(id) && this.itemdata[id].level !== undefined));
        let localbuffer = [];
        for (let idx = 0; idx < sorted.length; idx++) {
            let id = sorted[idx];
            const item = this.itemdata[id];
            localbuffer.push(<TargetItem item={item} lockable={false} handleClickItem={this.props.handleEquipItem}
                                         handleCtrlClickItem={handleCtrlClickItem}
                                         handleShiftClickItem={handleShiftClickItem}
                                         handleRightClickItem={(itemId) => this.props.handleRightClickItem(itemId, false)}
                                         handleDropItem={this.props.handleDropItem}
                                         key={id}/>);
        }
        if (localbuffer.length > 0) {
            buffer.push(<div className='item-section' key={this.class_idx++}>
                <span onClick={() => this.props.handleSettings(short, !this.props[short])}>{title}<br/></span>{
                this.props[short]
                    ? undefined
                    : localbuffer
            }
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
        this.render_equip(equip, '', compare, buffer, this.props.handleClickItem, this.props.handleCtrlClickItem, (itemId) => this.props.handleEditItem(itemId, -1), true);
        buffer.push(<SaveButtons {...this.props} loadoutURI={equip2url(equip, this.itemdata)}
                                 saveURI={equip2url(savedequip, this.itemdata)} key='savebuttons'/>)
        if (this.props.showsaved) {
            this.render_equip(savedequip, 'Saved ', compare, buffer, this.props.handleEquipItem, this.props.handleCtrlClickItem, false);
        }
        buffer.push(<div className='item-section' key='stats'
                         onClick={() => this.props.handleSettings('compactbonus', !this.props.compactbonus)}>{'Gear stats (change w.r.t. save slot)'}<br/><br/> {
            Object.getOwnPropertyNames(Factors).map((factor) => (
                (factor === 'NONE' || factor === 'DELETE' || factor === 'INSERT')
                    ? <div key={factor}/>
                    : <BonusLine itemdata={this.itemdata} equip={equip} savedequip={savedequip}
                                 compactbonus={this.props.compactbonus} factor={Factors[factor]}
                                 factors={this.props.factors} capstats={this.props.capstats}
                                 offhand={this.props.offhand * 5} key={factor}/>))
        }
        </div>);
        this.render_conditional(id => this.itemdata[id].level !== 100, 'Not maxed', buffer, this.props.handleCtrlClickItem, (itemId) => this.props.handleEditItem(itemId, -1));
        this.render_conditional(id => this.itemdata[id].disable, 'Disabled', buffer, this.props.handleCtrlClickItem, (itemId) => this.props.handleEditItem(itemId, -1));
        return (<div className='item-table'>
            {buffer}
        </div>);
    }
}
