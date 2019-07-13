import React, {Component} from 'react';
import ReactGA from 'react-ga';
import {Wish} from '../../Wish';

class Wishes extends Component {
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
                        ...this.props.wishstats
                };
                state = {
                        ...state,
                        [name]: val
                };
                this.props.handleWishSettings(state);
                if (val.length === 0) {
                        return;
                }
        }

        render() {
                ReactGA.pageview('/wishes/');
                let text = 'Input some things, then stuff happens. Power is total power, cap is amount you actually want to spend on wishes.';
                text += ' If you value hacks and wishes equally set R3 cap to 22.45% of your total R3 cap.';
                text += ' Take the wish speed modifier from the breakdown menu.';
                let wish = new Wish(this.props.wishstats);
                return (<div className='center'>
                        <form onSubmit={this.handleSubmit}>
                                {text}
                                <br/>
                                <br/>
                                <div>
                                        {
                                                ['eE', 'mM', 'rR'].map(x => <div key={x}>
                                                        <label >
                                                                {x[1] + ' power'}
                                                                <input style={{
                                                                                width: '100px',
                                                                                margin: '5px'
                                                                        }} type="text" value={this.props.wishstats[x[0] + 'pow']} onChange={(e) => this.handleChange(e, x[0] + 'pow')}/>
                                                        </label>
                                                        <label >
                                                                {' cap'}
                                                                <input style={{
                                                                                width: '100px',
                                                                                margin: '5px'
                                                                        }} type="text" value={this.props.wishstats[x[0] + 'cap']} onChange={(e) => this.handleChange(e, x[0] + 'cap')}/>
                                                        </label>
                                                </div>)
                                        }
                                </div>
                                <label>
                                        {'Wish speed modifier:'}
                                        <input style={{
                                                        width: '40px',
                                                        margin: '5px'
                                                }} type="text" value={this.props.wishstats.wishspeed} onChange={(e) => this.handleChange(e, 'wishspeed')} autoFocus={true} onFocus={this.handleFocus}/>
                                </label>
                                <br/>
                                <label>
                                        {'Minimal wish time:'}
                                        <input style={{
                                                        width: '40px',
                                                        margin: '5px'
                                                }} type="text" value={this.props.wishstats.wishcap} onChange={(e) => this.handleChange(e, 'wishcap')} autoFocus={true} onFocus={this.handleFocus}/> {' minutes'}
                                </label>
                                <br/>
                                <label>
                                        {'Wish:'}
                                        <input style={{
                                                        width: '40px',
                                                        margin: '5px'
                                                }} type="text" value={this.props.wishstats.wishidx} onChange={(e) => this.handleChange(e, 'wishidx')} autoFocus={true} onFocus={this.handleFocus}/>
                                </label>
                                <label>
                                        {' to level '}
                                        <input style={{
                                                        width: '20px',
                                                        margin: '5px'
                                                }} type="text" value={this.props.wishstats.goal} onChange={(e) => this.handleChange(e, 'goal')} autoFocus={true} onFocus={this.handleFocus}/>
                                </label>
                                <br/> {'requires: ' + wish.min_cap()}
                        </form>
                </div>);

        };
}

export default Wishes;
