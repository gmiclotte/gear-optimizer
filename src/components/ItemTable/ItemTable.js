import React from 'react';

import Item from '../Item/Item'
import './ItemTable.css';

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

export default class ItemTable extends React.Component {
        render() {
                //TODO: sorting on every change seems very inefficient
                let buffer = [];
                let compare = compare_factory(this.props.group)(this.props[this.props.type]);
                let class_idx = 0;
                {
                        let sorted = [...this.props[this.props.type].names].sort(compare);
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
                                localbuffer.push(<Item item={item} handleClickItem={this.props.handleClickItem} key={name}/>);
                                last = item;
                        }
                        buffer.push(<div className='item-section' key={class_idx}>
                                <span>{last[this.props.group][0]}<br/></span>{localbuffer}
                        </div>);
                }
                return (<div className='item-table'>
                        {buffer}
                </div>);
        }
}
