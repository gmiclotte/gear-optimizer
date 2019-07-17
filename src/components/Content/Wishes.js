import React, {Component} from 'react';
import ReactGA from 'react-ga';
import {Wish} from '../../Wish';
import {Wishes} from '../../assets/ItemAux'
import WishForm from '../WishForm/WishForm'

class WishComponent extends Component {
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
                state.goal = this.goallevel(state);
                state.start = this.startlevel(state);
                state.wishtime = this.wishtime(state);
                this.props.handleWishSettings(state);
                if (val.length === 0) {
                        return;
                }
        }

        goallevel(data) {
                if (data.goal < 1) {
                        return 1;
                }
                if (data.goal > Wishes[data.wishidx][2]) {
                        return Wishes[data.wishidx][2];
                }
                return data.goal;
        }

        startlevel(data) {
                if (data.start < 0) {
                        return 0;
                }
                if (data.start >= data.goal) {
                        return data.goal - 1;
                }
                return data.start;
        }

        wishtime(data) {
                if (data.wishtime < (data.goal - data.start) * data.wishcap) {
                        return (data.goal - data.start) * data.wishcap;
                }
                return data.wishtime;
        }

        render() {
                ReactGA.pageview('/wishes/');
                let text = 'Input some things, then stuff happens. Power is total power, cap is amount you actually want to spend on wishes.';
                text += ' If you value hacks and wishes equally set R3 cap to 22.45% of your total R3 cap.';
                text += ' Take the wish speed modifier from the breakdown menu and write it as a decimal, i.e. "100%" becomes "1.00".';
                text += ' Minimal wish time, is the time you want the final level to take.';
                text += ' Wish number is the same as the wish index in game, so wish 1 is "I wish that wishes weren\'t so slow :c", etc.';
                let wish = new Wish(this.props.wishstats);
                const mincap = wish.min_cap();
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
                                {/*<br/><label>
                                        {'Total available time:'}
                                        <input style={{
                                        width: '40px',
                                        margin: '5px'
                                        }} type="text" value={this.props.wishstats.wishtime} onChange={(e) => this.handleChange(e, 'wishcap')} autoFocus={true} onFocus={this.handleFocus}/> {' minutes'}
                                        </label>
                                        */
                                }
                                <br/> {[Wishes.keys()].map((idx) => (<div key={'factorform' + idx}><WishForm {...this.props} handleChange={this.handleChange} idx={idx}/></div>))}
                                {/*<label>
                                        {'Start level:'}
                                        <input style={{
                                        width: '20px',
                                        margin: '5px'
                                                }} type="text" value={this.props.wishstats.start} onChange={(e) => this.handleChange(e, 'goal')} autoFocus={true} onFocus={this.handleFocus}/>
                                        </label>*/
                                }
                                <label>
                                        {'Target level:'}
                                        <input style={{
                                                        width: '20px',
                                                        margin: '5px'
                                                }} type="text" value={this.props.wishstats.goal} onChange={(e) => this.handleChange(e, 'goal')} autoFocus={true} onFocus={this.handleFocus}/>
                                </label>
                                <br/> {
                                        mincap.length > 1
                                                ? 'Requires: ' + mincap[0]
                                                : mincap[0]
                                }
                                <br/> {
                                        mincap.length > 1 && mincap[1].length > 0
                                                ? 'Fastest possible is ' + mincap[1]
                                                : ''
                                }
                        </form>
                </div >);
        };
}

export default WishComponent;
