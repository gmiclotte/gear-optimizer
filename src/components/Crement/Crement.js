import React, {Component} from 'react';
import PropTypes from 'prop-types';

export default class Crement extends Component {
        static propTypes = {
                header: PropTypes.string.isRequired,
                handleClick: PropTypes.func.isRequired
        };

        render() {
                return (<>
                        <button type="button" onClick={() => this.props.handleClick(this.props.name, -1, this.props.min, this.props.max)}> - </button>
                        <button type="button" onClick={() => this.props.handleClick(this.props.name, 1, this.props.min, this.props.max)}> + </button>
                        {' ' + this.props.header + ': ' + this.props.value + ' '}
                </>);
        }
}

