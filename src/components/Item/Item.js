import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {getLock} from '../../util'

import './Item.css';

function importAll(r) {
        let images = {};
        r.keys().map((item, index) => {
                images[item.replace('./', '').replace(/\.[^/.]+$/, '')] = r(item);
                return undefined;
        });
        return images;
}
const images = importAll(require.context('../../assets/img/', false, /\.(png|jpe?g|svg)$/));

export default class Item extends Component {
        static propTypes = {
                item: PropTypes.shape({name: PropTypes.string.isRequired, level: PropTypes.number}),
                handleClickItem: PropTypes.func.isRequired,
                handleRightClickItem: PropTypes.func.isRequired
        };

        render() {
                let item = this.props.item;
                let classNames = 'item' + this.props.className;
                const locked = this.props.lockable && getLock(this.props.item.slot[0], this.props.idx, this.props.locked);
                if (locked) {
                        classNames += ' lock-item'
                }
                if (item === undefined) {
                        return (<span><img className={classNames} data-tip='Empty slot' src={images.logo} alt='Empty'/>
                        </span>);
                }
                let tt = '(' + item.id + ') ' + item.name + (
                        item.empty
                        ? ''
                        : ' lvl ' + item.level) + '<br />';
                item.statnames.map((stat, idx) => {
                        const formatted = (val) => {
                                if (stat === 'Power' || stat === 'Toughness') {
                                        return val.toLocaleString(undefined, {maximumFractionDigits: 2});
                                }
                                return val.toLocaleString(undefined, {maximumFractionDigits: 2}) + '%';
                        };
                        tt += '<br />' + stat + ': ' + formatted(item[stat]);
                        return undefined;
                })
                classNames += item.disable
                        ? ' disable-item'
                        : '';
                classNames += ' ' + item.slot[0]
                let imgname = item.id;
                if (images[imgname] === undefined) {
                        imgname = item.name;
                        imgname = imgname.replace(/</g, '');
                        imgname = imgname.replace(/!/g, '');
                }
                return (<img className={classNames} 
                        onClick={(e) => {
                                if (e.ctrlKey) {
                                        this.props.handleCtrlClickItem(item.id);
                                } else {
                                        this.props.handleClickItem(item.id);
                                }
                        }} 
                        onContextMenu={(e) => {
                                if (!item.empty) {
                                        console.log(item)
                                        this.props.handleRightClickItem(item.id);
                                }
                                e.preventDefault();
                        }} 
                        data-tip={tt} src={images[imgname]} alt={item.id} key='item'/>);
        }
}
