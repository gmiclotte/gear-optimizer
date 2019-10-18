import React, {Component} from 'react';
import PropTypes from 'prop-types';

export default class OptimizeButton extends Component {
        static propTypes = {
                running: PropTypes.bool.isRequired,
                abort: PropTypes.func.isRequired,
                optimize: PropTypes.func.isRequired
        };

        render() {
                if (this.props.running) {
                        return (<button onClick={() => this.props.abort()}>
                                Abort
                        </button>);
                } else {
                        return (<button onClick={() => this.props.optimize()}>
                                {'Optimize ' + this.props.text}
                        </button>);
                }
        }
}
