import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {default as Crement} from '../Crement/Crement';
import {default as ItemTable} from '../ItemTable/ItemTable';
import {default as OptimizeButton} from '../OptimizeButton/OptimizeButton';

import './Content.css';

function do_nothing() {}

class Content extends Component {
        static propTypes = {
                className: PropTypes.string.isRequired
        };

        static defaultProps = {
                items: [],
                equip: [],
                accslots: 0,
                respawn: 0
        };

        render() {
                return (<div className={this.props.className}>
                        <Crement header='Accessory slots' value={this.props.accslots} name='accslots' handleClick={this.props.handleCrement} min={0} max={100}/>
                        <Crement header='Max respawn items' value={this.props.respawn} name='respawn' handleClick={this.props.handleCrement} min={0} max={this.props.accslots}/>
                        <OptimizeButton {...this.props} handleClick={this.props.handleOptimizeGear}/>
                        <div className="content__container">
                                <ItemTable {...this.props} group={'slot'} type='equip' handleClickItem={this.props.handleUnequipItem} handleDoubleClickItem={do_nothing}/>
                                <ItemTable {...this.props} group={'zone'} type='items' handleClickItem={this.props.handleDisableItem} handleDoubleClickItem={this.props.handleEquipItem}/>
                        </div>
                </div>);
        };
}

export default Content;
