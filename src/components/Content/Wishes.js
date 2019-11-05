import React, {Component} from 'react';
import ReactGA from 'react-ga';
import {Wish} from '../../Wish';
import {Wishes} from '../../assets/ItemAux';
import ResourcePriorityForm from '../ResourcePriorityForm/ResourcePriorityForm';
import WishForm from '../WishForm/WishForm';
import {default as Crement} from '../Crement/Crement';
import {shortenExponential, to_time} from '../../util';

class WishComponent extends Component {
        constructor(props) {
                super(props);
                this.handleChange = this.handleChange.bind(this);
                this.handleSubmit = this.handleSubmit.bind(this);
        }

        handleFocus(event) {
                event.target.select();
        }

        handleSubmit(event) {
                event.preventDefault();
        }

        handleChange(event, name, idx = -1) {
                let val = event.target.value;
                let wishstats = {
                        ...this.props.wishstats
                };
                if (idx < 0) {
                        wishstats = {
                                ...wishstats,
                                [name]: val
                        };
                        this.props.handleSettings('wishstats', wishstats);
                        return;
                }
                let wishes = [...wishstats.wishes];
                let wish = {
                        ...wishes[idx],
                        [name]: val
                };
                wish.goal = this.goallevel(wish);
                wish.start = this.startlevel(wish);
                wishes[idx] = wish;
                wishstats = {
                        ...wishstats,
                        wishes: wishes
                };
                this.props.handleSettings('wishstats', wishstats);
                return;
        }

        goallevel(data) {
                data.goal = Number(data.goal)
                if (data.goal < 1) {
                        return 0;
                }
                if (data.goal > Wishes[data.wishidx][2]) {
                        return Wishes[data.wishidx][2];
                }
                return data.goal;
        }

        startlevel(data) {
                data.start = Number(data.start)
                if (data.start < 0 || data.goal === 0) {
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

        copyToClipboard(e) {
                e.target.select();
                document.execCommand('copy');
        };

        render() {
                ReactGA.pageview('/wishes/');
                let wish = new Wish(this.props.wishstats);
                const results = wish.optimize();
                /*
                to_time(Math.max(...scores)),
                tmp.map(a => shortenExponential(a[0]) + ' E; ' + shortenExponential(a[1]) + ' M; ' + shortenExponential(a[2]) + ' R3'),
                shortenExponential(res[0]) + ' E; ' + shortenExponential(res[1]) + ' M; ' + shortenExponential(res[2]) + ' R3'
                */
                const score = to_time(Math.max(...results[0]));
                const assignments = results[1];
                const remaining = results[2];
                return (<div className='center'>
                        <form onSubmit={this.handleSubmit}>
                                <div>
                                        {
                                                ['eE', 'mM', 'rR'].map(x => <div key={x}>
                                                        <label >
                                                                {x[1] + ' power'}
                                                                <input style={{
                                                                                width: '100px',
                                                                                margin: '5px'
                                                                        }} type="number" step="any" value={this.props.wishstats[x[0] + 'pow']} onFocus={this.handleFocus} onChange={(e) => this.handleChange(e, x[0] + 'pow')}/>
                                                        </label>
                                                        <label >
                                                                {' cap'}
                                                                <input style={{
                                                                                width: '100px',
                                                                                margin: '5px'
                                                                        }} type="number" step="any" value={this.props.wishstats[x[0] + 'cap']} onFocus={this.handleFocus} onChange={(e) => this.handleChange(e, x[0] + 'cap')}/>
                                                        </label>
                                                </div>)
                                        }
                                </div>
                                <label>
                                        {'Wish speed modifier:'}
                                        <input style={{
                                                        width: '60px',
                                                        margin: '5px'
                                                }} type="number" step="any" value={this.props.wishstats.wishspeed} onFocus={this.handleFocus} onChange={(e) => this.handleChange(e, 'wishspeed')}/>
                                </label>
                                <br/>
                                <label>
                                        {'Minimal wish time:'}
                                        <input style={{
                                                        width: '60px',
                                                        margin: '5px'
                                                }} type="number" step="any" value={this.props.wishstats.wishcap} onFocus={this.handleFocus} onChange={(e) => this.handleChange(e, 'wishcap')}/> {' minutes'}
                                </label>
                                <br/> {'Resource spending order:'}
                                {<ResourcePriorityForm {...this.props} handleChange={this.handleChange}/>}
                                <div><Crement header='Wish slots' value={this.props.wishstats.wishes.length} name='wishslots' handleClick={this.props.handleCrement} min={1} max={100}/></div>
                                <br/> {
                                        this.props.wishstats.wishes.map((wish, pos) => <div key={pos}>
                                                {
                                                        [Wishes.keys()].map(idx => (<div style={{
                                                                        display: 'inline'
                                                                }} key={'wishform' + pos}><WishForm {...this.props} handleChange={this.handleChange} wishidx={wish.wishidx} idx={pos}/></div>))
                                                }<br/>
                                                <label>
                                                        {' Start level:'}<input style={{
                                                        width: '30px',
                                                        margin: '5px'
                                                }} type="number" step="any" value={this.props.wishstats.wishes[pos].start} onFocus={this.handleFocus} onChange={(e) => this.handleChange(e, 'start', pos)}/>
                                                </label>
                                                <label>
                                                        {' Target level:'}<input style={{
                                                        width: '30px',
                                                        margin: '5px'
                                                }} type="number" step="any" value={this.props.wishstats.wishes[pos].goal} onFocus={this.handleFocus} onChange={(e) => this.handleChange(e, 'goal', pos)}/>
                                                </label>
                                        </div>)
                                }
                                <br/> {
                                        assignments.map((a, idx) => <div key={idx}>
                                                {'Wish ' + this.props.wishstats.wishes[idx].wishidx + ' requires: '}
                                                {
                                                        a.map((val, jdx) => <div key={jdx} style={{
                                                                        display: 'inline-block'
                                                                }}>
                                                                <textarea onFocus={this.copyToClipboard} readOnly={true} rows={1} cols={9} key={jdx + 'text'} value={shortenExponential(val)}/>
                                                                <div key={jdx + 'div'} style={{
                                                                                paddingRight: '5px',
                                                                                display: 'inline-block'
                                                                        }}>{'EMR'[jdx]}</div>
                                                        </div>)
                                                }
                                        </div>)
                                }<br/> {'After ' + score + ' all targets will be reached.'}
                                <br/>
                                <br/> {'Spare resources: '}
                                {
                                        remaining.map((val, jdx) => <div key={jdx} style={{
                                                        display: 'inline-block'
                                                }}>
                                                <textarea onFocus={this.copyToClipboard} readOnly={true} rows={1} cols={9} key={jdx + 'text'} value={shortenExponential(val)}/>
                                                <div key={jdx + 'div'} style={{
                                                                paddingRight: '5px',
                                                                display: 'inline-block'
                                                        }}>{'EMR'[jdx]}</div>
                                        </div>)
                                }
                        </form>
                </div >);
        };
}

export default WishComponent;
