import React, {Component} from 'react';
import PropTypes from 'prop-types';

export default class OptimizeButton extends Component {
        static propTypes = {
                handleClick: PropTypes.func.isRequired
        };

        render() {
                return (<button onClick={() => this.props.handleClick()}>
                        Optimize Gear
                </button>);
        }
}
