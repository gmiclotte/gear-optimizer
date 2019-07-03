import React, {Component} from 'react';
import ReactGA from 'react-ga';

class Button extends Component {
        render() {
                if (this.props.running) {
                        return (<button onClick={() => this.props.abort()}>
                                Abort
                        </button>);
                } else {
                        return (<button onClick={() => {
                                        this.props.handleAugmentSettings(this.props.state.lsc, this.props.state.time);
                                        this.props.handleAugmentAsync();
                                }}>
                                {'Compute augments.'}
                        </button>);
                }
        }
}

class Augment extends Component {
        constructor(props) {
                super(props);
                this.handleChange = this.handleChange.bind(this);
                this.handleSubmit = this.handleSubmit.bind(this);
        }

        handleSubmit(event) {
                event.preventDefault();
        }

        handleChange(event, name) {
                let val = event.target.value;
                let state = {
                        lsc: this.props.augment.lsc,
                        time: this.props.augment.time
                };
                state = {
                        ...state,
                        [name]: val
                };
                this.props.handleAugmentSettings(state.lsc, state.time);
                if (val.length === 0) {
                        return;
                }
                if (!this.props.running && state.lsc >= 0 && state.time > 0.003) {
                        this.props.handleAugmentAsync();
                }
        }

        names = [
                'scissors',
                'milk',
                'cannon',
                'mounted',
                'buster',
                'exo',
                'laser sword'
        ];

        aug(idx, val, s) {
                return val[s] + ' / ' + val[s + 1] + ' ' + this.names[idx];
        }

        line(val, idx) {
                return <div key={idx}>{this.aug(idx, val, 0) + '\t==\t' + this.aug(idx + 1, val, 3) + '\n'}</div>;
        }

        render() {
                ReactGA.pageview('/augment/');
                const vals = this.props.augment.vals;
                let text = 'Augment thresholds. Assumes optimal energy ratio, i.e. the exponent ratio, between augment and upgrade. ';
                text += 'Assumes you are limited by energy, not by gold. ';
                text += 'Augments run for ' + this.props.augment.time + ' minutes, with ' + this.props.augment.lsc + ' laser sword challenge completions.';
                return (<div className='center'>
                        <form onSubmit={this.handleSubmit}>
                                <label>
                                        {'LSC completions:'}
                                        <input style={{
                                                        width: '30px',
                                                        margin: '5px'
                                                }} type="text" value={this.props.augment.lsc} onChange={(e) => this.handleChange(e, 'lsc')}/>
                                </label>
                                <br/>
                                <label>
                                        {'Augment time:'}
                                        <input style={{
                                                        width: '40px',
                                                        margin: '5px'
                                                }} type="text" value={this.props.augment.time} onChange={(e) => this.handleChange(e, 'time')} autoFocus={true} onFocus={this.handleFocus}/>
                                </label>
                        </form>
                        <Button {...this.props} state={this.props.augment} abort={this.props.handleTerminate}/>
                        <br/>
                        <br/>
                        <div>{text}</div>
                        <br/>
                        <div>{vals.map((val, idx) => (this.line(val, idx)))}</div>
                </div>);

        };
}

export default Augment;
