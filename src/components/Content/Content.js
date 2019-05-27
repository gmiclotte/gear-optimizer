import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {default as ItemTable} from '../ItemTable/ItemTable';

import './Content.css';

function do_nothing() {
        console.log('doing nothing');
}

class Content extends Component {
        static propTypes = {
                className: PropTypes.string.isRequired
        };

        static defaultProps = {
                items: [],
                equip: []
        };

        render() {
                return (<div className={this.props.className}>
                        <div className="content__container">
                                <ItemTable {...this.props} group={'slot'} type='equip' handleClickItem={this.props.handleUnequipItem} handleDoubleClickItem={do_nothing}/>
                                <ItemTable {...this.props} group={'zone'} type='items' handleClickItem={this.props.handleDisableItem} handleDoubleClickItem={this.props.handleEquipItem}/>
                        </div>
                </div>);
        };
}

export default Content;
