import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {default as ItemTable} from '../ItemTable';

import './Content.css';

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
                                <div className="content__p">
                                        <ItemTable {...this.props} type='items' handleClickItem={this.props.handleEquipItem}/>
                                        <ItemTable {...this.props} type='equip' handleClickItem={this.props.handleUnequipItem}/>
                                </div>
                        </div>
                </div>);
        };
}

export default Content;
