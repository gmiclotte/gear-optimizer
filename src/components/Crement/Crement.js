import React, {Component} from 'react';
import PropTypes from 'prop-types';

export default class Crement extends Component {
    static propTypes = {
        header: PropTypes.string.isRequired,
        handleClick: PropTypes.func.isRequired
    };

    render() {
        const isInfinity = this.props.value === Infinity;
        return (
            <div className="crement-container">
                <button type="button"
                        className="crement-button"
                        onClick={() => this.props.handleClick(this.props.name, -1, this.props.min, this.props.max)}> -
                </button>
                <button type="button"
                        className="crement-button"
                        onClick={() => this.props.handleClick(this.props.name, 1, this.props.min, this.props.max)}> +
                </button>
                {this.props.header + ': '}
                <span className="crement-value" style={{fontSize: isInfinity ? '2em' : '1em'}}>
                    {isInfinity ? '∞' : this.props.value}
                </span>
            </div>
        );
    }
}