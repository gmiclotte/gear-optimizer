import React, {Component} from 'react';
import ReactGA from 'react-ga';
import {Wish} from '../../Wish';
import {Wishes} from '../../assets/ItemAux'
import WishForm from '../WishForm/WishForm'
import {default as Crement} from '../Crement/Crement';

class WishComponent extends Component {
        constructor(props) {
                super(props);
                this.handleChange = this.handleChange.bind(this);
                this.handleSubmit = this.handleSubmit.bind(this);
        }

        handleSubmit(event) {
                event.preventDefault();
        }

        handleChange(event, name, idx = -1) {
                let val = event.target.value;
                let state = {
                        ...this.props.wishstats
                };
                if (idx < 0) {
                        state = {
                                ...state,
                                [name]: val
                        };
                        state.goal = this.goallevel(state);
                        //state.start = this.startlevel(state);
                        //state.wishtime = this.wishtime(state);
                        this.props.handleWishSettings(state);
                        return;
                }
                let wishes = [...state.wishes];
                let wish = {
                        ...wishes[idx],
                        [name]: val
                };
                wish.goal = this.goallevel(wish);
                wishes[idx] = wish;
                state = {
                        ...state,
                        wishes: wishes
                };
                this.props.handleWishSettings(state);
                return;
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
                let text = 'Provide the required data in all input fields, please consider scientific notation, e.g. 1e6 instead of 1000000, or have fun counting zeroes.'
                text += ' Power is total power, cap is amount you actually want to spend on wishes.';
                text += ' For example: if you value hacks and wishes equally, then you could set R3 cap to 22.44% of your total R3 cap.';
                text += ' Take the wish speed modifier from the breakdown menu and write it as a decimal, i.e. "100%" becomes "1.00".';
                text += ' Minimal wish time, is the time you want the final level to take.';
                let wish = new Wish(this.props.wishstats);
                const mincap = wish.min_cap();
                const results = wish.optimize();
                const score = results[0];
                const assignments = results[1];
                const remaining = results[2];
                return (<div className='center'>
                        <form onSubmit={this.handleSubmit}>
                                {'Work In Progress: it might not work, some features aren\'t in yet, and it definitely won\'t look pretty.'}
                                <br/>
                                <br/> {text}
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
                                <br/> {[Wishes.keys()].map((idx) => (<div key={'wishform' + idx}><WishForm {...this.props} handleChange={this.handleChange} wishidx={this.props.wishstats.wishidx} idx={-1}/></div>))}
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
                                                ? 'Requires: ' + mincap[0] + ' to complete in ' + this.props.wishstats.wishcap + ' minutes.'
                                                : mincap[0]
                                }
                                <br/> {
                                        mincap.length > 1 && mincap[1].length > 0
                                                ? 'With available resources it will take ' + mincap[1] + '.'
                                                : ''
                                }
                                <br/><br/> {'Select some wishes and target levels. For now it is assumed that you are at level "target - 1". '}
                                {'A possible allocation of EMR cap will be suggested to reach the target level in each of these wishes in (close to) the shortest possible time. '}
                                <br/> {'A small fraction (0.1%) of each resource cap is initially assigned to each wish. After this, resources are assigned in the following order: M>E>R. '}
                                {'Other assignment priorities could be added, but let me know if you want that. '}
                                <br/><br/>
                                <div><Crement header='Wish slots' value={this.props.wishstats.wishes.length} name='wishslots' handleClick={this.props.handleCrement} min={1} max={100}/></div>
                                {
                                        this.props.wishstats.wishes.map((wish, pos) => <div key={pos}>
                                                {
                                                        [Wishes.keys()].map(idx => (<div style={{
                                                                        display: 'inline'
                                                                }} key={'wishform' + pos}><WishForm {...this.props} handleChange={this.handleChange} wishidx={wish.wishidx} idx={pos}/></div>))
                                                }
                                                {' Target level:'}<input style={{
                                                        width: '20px',
                                                        margin: '5px'
                                                }} type="text" value={this.props.wishstats.wishes[pos].goal} onChange={(e) => this.handleChange(e, 'goal', pos)} autoFocus={true} onFocus={this.handleFocus}/>
                                        </div>)
                                }{
                                        assignments.map((a, idx) => <div key={idx}>
                                                {'Wish ' + this.props.wishstats.wishes[idx].wishidx + ' requires: ' + a}
                                        </div>)
                                }
                                {'After ' + score + ' all targets will be reached.'}
                                <br/> {'Spare resources: ' + remaining}
                        </form>
                </div >);
        };
}

export default WishComponent;
