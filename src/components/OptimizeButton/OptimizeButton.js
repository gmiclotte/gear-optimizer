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
                        return (<button onClick={() => this.props.abort(this.props.fast)}>
                                Abort
                        </button>);
                } else {
                        return (<button onClick={() => this.props.optimize(this.props.fast)}>
                                {
                                        this.props.fast
                                                ? 'Optimize Fast'
                                                : 'Optimize Gear'
                                }
                        </button>);
                }
        }
}
