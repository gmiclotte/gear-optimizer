import React, {Component} from 'react';
import ReactGA from 'react-ga';

class Button extends Component {
        render() {
                if (this.props.running) {
                        return (<button onClick={() => this.props.abort(this.props.fast)}>
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

        render() {
                ReactGA.pageview('/augment/');
                //if (this.props.augment.lsc != this.state.lsc || this.props.augment.time != this.state.time) {
                //this.setState({lsc: this.props.augment.lsc, time: this.props.augment.time});
                //}
                const vals = this.props.augment.vals;
                const names = [
                        'scissors',
                        'milk',
                        'cannon',
                        'mounted',
                        'buster',
                        'exo',
                        'laser sword'
                ];
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
                        <div>{'Augment thresholds. Assumes optimal energy ratio, i.e. the exponent ratio, between augment and upgrade. Augments run for ' + this.props.augment.time + ' minutes, with ' + this.props.augment.lsc + ' laser sword challenge completions.'}</div>
                        <br/>
                        <div>{vals.map((val, idx) => (<div key={idx}>{val[0] + '/' + val[1] + ' ' + names[idx] + '\t==\t' + val[3] + '/' + val[4] + ' ' + names[idx + 1] + '\n'}</div>))}</div>
                </div>);

        };
}

export default Augment;
