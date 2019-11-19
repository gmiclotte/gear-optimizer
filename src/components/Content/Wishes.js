import React, {Component} from 'react';
import ReactGA from 'react-ga';
import {Wish} from '../../Wish';
import {Wishes} from '../../assets/ItemAux';
import ResourcePriorityForm from '../ResourcePriorityForm/ResourcePriorityForm';
import WishForm from '../WishForm/WishForm';
import {default as Crement} from '../Crement/Crement';
import {shortenExponential, toTime} from '../../util';
import ModifierForm from '../ModifierForm/ModifierForm';

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
                let wish = new Wish(this.props);
                const results = wish.optimize();
                const score = toTime(Math.max(...results[0]));
                const scores = results[0];
                const assignments = results[1];
                const remaining = results[2];
                const trueScores = results[3];
                return (<div className='center'>
                        <form onSubmit={this.handleSubmit}>
                                <div>
                                        {
                                                ['eE', 'mM', 'rR'].map(x => <div key={x}>
                                                        <label >
                                                                {x[1] + ' power'}
                                                                <input style={{
                                                                                width: '11ch',
                                                                                margin: '1ch'
                                                                        }} type="number" step="any" value={this.props.wishstats[x[0] + 'pow']} onFocus={this.handleFocus} onChange={(e) => this.handleChange(e, x[0] + 'pow')}/>
                                                        </label>
                                                        <label >
                                                                {' cap'}
                                                                <input style={{
                                                                                width: '11ch',
                                                                                margin: '1ch'
                                                                        }} type="number" step="any" value={this.props.wishstats[x[0] + 'cap']} onFocus={this.handleFocus} onChange={(e) => this.handleChange(e, x[0] + 'cap')}/>
                                                        </label>
                                                </div>)
                                        }
                                </div>
                                <label>
                                        {'Wish speed modifier:'}
                                        <input style={{
                                                        width: '6.6ch',
                                                        margin: '1ch'
                                                }} type="number" step="any" value={this.props.wishstats.wishspeed} onFocus={this.handleFocus} onChange={(e) => this.handleChange(e, 'wishspeed')}/>
                                </label>
                                <br/>
                                <ModifierForm {...this.props} name={'wishstats'} e={true} m={true} r={true}/>
                                <label>
                                        {'Minimal wish time:'}
                                        <input style={{
                                                        width: '6.6ch',
                                                        margin: '1ch'
                                                }} type="number" step="any" value={this.props.wishstats.wishcap} onFocus={this.handleFocus} onChange={(e) => this.handleChange(e, 'wishcap')}/> {' minutes'}
                                </label>
                                <br/> {<ResourcePriorityForm {...this.props} handleChange={this.handleChange}/>}
                                <div><Crement header='Wish slots' value={this.props.wishstats.wishes.length} name='wishslots' handleClick={this.props.handleCrement} min={1} max={100}/></div>
                                <br/> {
                                        this.props.wishstats.wishes.map((wish, pos) => <div key={pos}>
                                                {
                                                        [Wishes.keys()].map(idx => (<div style={{
                                                                        display: 'inline'
                                                                }} key={'wishform' + pos}><WishForm {...this.props} handleChange={this.handleChange} wishidx={wish.wishidx} idx={pos}/></div>))
                                                }
                                                <br/>
                                                <label>
                                                        {' Start level:'}<input style={{
                                                        width: '4.4ch',
                                                        margin: '1ch'
                                                }} type="number" step="any" value={this.props.wishstats.wishes[pos].start} onFocus={this.handleFocus} onChange={(e) => this.handleChange(e, 'start', pos)}/>
                                                </label>
                                                <label>
                                                        {' Target level:'}<input style={{
                                                        width: '4.4ch',
                                                        margin: '1ch'
                                                }} type="number" step="any" value={this.props.wishstats.wishes[pos].goal} onFocus={this.handleFocus} onChange={(e) => this.handleChange(e, 'goal', pos)}/>
                                                </label>
                                        </div>)
                                }</form>
                        <br/>
                        <table style={{
                                        display: 'inline-block'
                                }}>
                                <tbody>{
                                                assignments.map((a, idx) => <tr key={idx}>
                                                        <td>{'Wish ' + this.props.wishstats.wishes[idx].wishidx + ' requires: '}</td>
                                                        {
                                                                a.map((val, jdx) => <td key={jdx} style={{
                                                                                display: 'inline-block'
                                                                        }}>
                                                                        <input style={{
                                                                                        resize: 'none',
                                                                                        width: '9ch'
                                                                                }} onFocus={this.copyToClipboard} readOnly={true} key={jdx + 'text'} value={shortenExponential(val)}/>
                                                                        <div key={jdx + 'div'} style={{
                                                                                        paddingRight: '1ch',
                                                                                        display: 'inline-block'
                                                                                }}>{['E', 'M', 'R'][jdx]}</div>
                                                                </td>)
                                                        }
                                                        <td>{toTime(scores[idx])}</td>
                                                </tr>)
                                        }</tbody>
                        </table><br/> {'After ' + score + ' all targets will be reached.'}
                        <br/>
                        <br/> {'Spare resources: '}
                        {
                                remaining.map((val, jdx) => <div key={jdx} style={{
                                                display: 'inline-block'
                                        }}>
                                        <input style={{
                                                        resize: 'none',
                                                        width: '9ch'
                                                }} onFocus={this.copyToClipboard} readOnly={true} key={jdx + 'text'} value={shortenExponential(val)}/>
                                        <div key={jdx + 'div'} style={{
                                                        paddingRight: '1ch',
                                                        display: 'inline-block'
                                                }}>{['E', 'M', 'R'][jdx]}</div>
                                </div>)
                        }
                        <br/>
                        <br/>
                        <div>{'Beta: wish time estimation'}
                                <label>
                                        <input type="checkbox" checked={this.props.wishstats.trueTime} onChange={(e) => this.props.handleSettings('wishstats', {
                                                        ...this.props.wishstats,
                                                        trueTime: !this.props.wishstats.trueTime
                                                })}/>
                                </label>
                        </div>
                        {
                                this.props.wishstats.trueTime
                                        ? <table style={{
                                                                display: 'inline-block'
                                                        }}>
                                                        <tbody>
                                                                <tr>
                                                                        <th>{'Wish'}</th>
                                                                        <th>{'in theory'}</th>
                                                                        <th>{'in practice'}</th>
                                                                </tr>
                                                                {
                                                                        this.props.wishstats.wishes.map((wish, pos) => <tr key={pos}>
                                                                                <td>{wish.wishidx + ' (' + wish.start + ' → ' + wish.goal + ')'}</td>
                                                                                <td>{toTime(scores[pos])}</td>
                                                                                <td>{toTime(trueScores[pos])}</td>
                                                                        </tr>)
                                                                }</tbody>
                                                </table>
                                        : <div/>
                        }
                </div>)
        };
}

export default WishComponent;
