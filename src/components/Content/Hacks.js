import React, {Component} from 'react';
import ReactGA from 'react-ga';
import {Hack} from '../../Hack';
import {Hacks} from '../../assets/ItemAux';
import {shorten, to_time} from '../../util';

class HackComponent extends Component {
        constructor(props) {
                super(props);
                this.state = {
                        hackoption: this.props.hackstats.hackoption
                };
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
                let hackstats = {
                        ...this.props.hackstats
                };
                if (idx < 0) {
                        hackstats = {
                                ...hackstats,
                                [name]: val
                        };
                        this.props.handleSettings('hackstats', hackstats);
                        return;
                }
                let hacks = [...hackstats.hacks];
                let hack;
                if (name === 'msup' || name === 'msdown') {
                        let goal = hacks[idx].goal;
                        const reducer = hacks[idx].reducer;
                        const msgap = Hacks[idx][4] - reducer;
                        goal = goal / msgap
                        goal += name === 'msup'
                                ? 1
                                : -1;
                        goal = name === 'msup'
                                ? Math.floor(goal)
                                : Math.ceil(goal);
                        goal *= msgap;
                        hack = {
                                ...hacks[idx],
                                goal: goal
                        };
                } else {
                        hack = {
                                ...hacks[idx],
                                [name]: val
                        };
                }
                hack.goal = this.level(hack.goal, idx);
                hack.level = this.level(hack.level, idx);
                hack.reducer = this.reducer(hack);
                hacks[idx] = hack;
                hackstats = {
                        ...hackstats,
                        hacks: hacks
                };
                this.props.handleSettings('hackstats', hackstats);
                return;
        }

        level(level, idx) {
                level = Number(level)
                if (level <= 0) {
                        return level;
                }
                const levelCap = Hacks[idx][5];
                if (level > levelCap) {
                        return levelCap;
                }
                return level;
        }

        startlevel(data) {
                data.level = Number(data.level)
                if (data.level <= 0) {
                        return 0;
                }
                let levelCap = Hacks[data.hackidx][5];
                if (data.level > levelCap) {
                        return levelCap;
                }
                return data.level;
        }

        reducer(data) {
                data.reducer = Number(data.reducer)
                if (data.reducer < 1) {
                        return 0;
                }
                let milestone = Hacks[data.hackidx][4];
                if (data.reducer > milestone - 2) {
                        return milestone - 2;
                }
                return data.reducer;
        }

        render() {
                ReactGA.pageview('/hacks/');
                let hackOptimizer = new Hack(this.props.hackstats);
                const hacktime = this.props.hackstats.hacktime;
                const options = [0, 1, 2];
                const option = this.props.hackstats.hackoption;
                const classTarget = option === '0'
                        ? ''
                        : 'hide';
                const classLevel = option === '1'
                        ? ''
                        : 'hide';
                const classMS = option === '2'
                        ? ''
                        : 'hide';
                let sumtime = 0;
                let hackhacktime = 0;
                let hackhackchange = 1;
                //HACK: this sets the dropdown to the correct value after loading
                if (this.state.hackoption !== this.props.hackstats.hackoption) {
                        /* eslint-disable-next-line react/no-direct-mutation-state */
                        this.state.hackoption = this.props.hackstats.hackoption;
                }
                return (<div className='center'>
                        <form onSubmit={this.handleSubmit}>
                                <table className='center'>
                                        <tbody>
                                                <tr>
                                                        <td>{'R power'}</td>
                                                        <td>
                                                                <label >
                                                                        <input style={{
                                                                                        width: '100px',
                                                                                        margin: '5px'
                                                                        }} type="number" step="any" value={this.props.hackstats['rpow']} onFocus={this.handleFocus} onChange={(e) => this.handleChange(e, 'rpow')}/>
                                                                </label>
                                                        </td>
                                                </tr>
                                                <tr>
                                                        <td>{'R cap'}</td>
                                                        <td>
                                                                <label >
                                                                        <input style={{
                                                                                        width: '100px',
                                                                                        margin: '5px'
                                                                                }} type="number" step="any" value={this.props.hackstats['rcap']} onFocus={this.handleFocus} onChange={(e) => this.handleChange(e, 'rcap')}/>
                                                                </label>
                                                        </td>
                                                </tr>
                                                <tr>
                                                        <td>{'Hack speed'}</td>
                                                        <td>
                                                                <label>
                                                                        <input style={{
                                                                                        width: '100px',
                                                                                        margin: '5px'
                                                                                }} type="number" step="any" value={this.props.hackstats.hackspeed} onFocus={this.handleFocus} onChange={(e) => this.handleChange(e, 'hackspeed')}/>
                                                                </label>
                                                        </td>
                                                </tr>
                                                <tr>
                                                        <td>{'Hack time (minutes)'}</td>
                                                        <td>
                                                                <label>
                                                                        <input style={{
                                                                                        width: '100px',
                                                                                        margin: '5px'
                                                                                }} type="number" step="any" value={hacktime} onFocus={this.handleFocus} onChange={(e) => this.handleChange(e, 'hacktime')}/>
                                                                </label>
                                                        </td>
                                                </tr>
                                                <tr>
                                                        <td>{'Hack Optimizer Mode'}</td>
                                                        <td>
                                                                <label key='hackoption'>
                                                                        <select value={this.state.hackoption} onChange={(e) => this.handleChange(e, 'hackoption')}>
                                                                                {
                                                                                        options.map((option, idx) => (<option value={idx} key={idx}>{
                                                                                                        [
                                                                                                                'level target.', 'max level in ' + to_time(hacktime * 60 * 50),
                                                                                                                'max MS in ' + to_time(hacktime * 60 * 50)
                                                                                                        ][idx]
                                                                                                }</option>))
                                                                                }
                                                                        </select>
                                                                </label>
                                                        </td>
                                                </tr>
                                        </tbody>
                                </table>
                                <table className='center'>
                                        <tbody>
                                                <tr>
                                                        <th>Hack</th>
                                                        <th>Milestone<br/>Reducers</th>
                                                        <th>Level</th>
                                                        <th>Bonus</th>
                                                        <th className={classTarget}>Target</th>
                                                        <th className={classLevel}>Max Level<br/>in {hacktime}min</th>
                                                        <th className={classMS}>Max MS<br/>in {hacktime}min</th>
                                                        <th>MS</th>
                                                        <th>Time</th>
                                                        <th>Bonus</th>
                                                        <th>Change</th>
                                                        <th>Next Level</th>
                                                        <th className={classTarget}>Next Level<br/>After Target</th>
                                                        <th className={classLevel}>Next Level<br/>After Max Level</th>
                                                        <th className={classMS}>Next Level<br/>After Max MS</th>
                                                </tr>
                                                {
                                                        Hacks.map((hack, pos) => {
                                                                const reducer = this.props.hackstats.hacks[pos].reducer;
                                                                const level = this.props.hackstats.hacks[pos].level;
                                                                const currBonus = hackOptimizer.bonus(level, pos);
                                                                let target = 0;
                                                                if (option === '0') {
                                                                        target = this.props.hackstats.hacks[pos].goal;

                                                                } else {
                                                                        target = hackOptimizer.reachable(level, hacktime, pos);
                                                                        if (option === '2') {
                                                                                target = hackOptimizer.milestoneLevel(target, pos);
                                                                        }
                                                                }
                                                                let bonus = target > level
                                                                        ? hackOptimizer.bonus(target, pos)
                                                                        : currBonus;
                                                                let time = hackOptimizer.time(level, target, pos);
                                                                let timePastLevel = hackOptimizer.time(level, level + 1, pos);
                                                                let timePastTarget = hackOptimizer.time(level, target + 1, pos) - hackOptimizer.time(level, target, pos);
                                                                let mschange = target > level
                                                                        ? hackOptimizer.milestones(target, pos) - hackOptimizer.milestones(level, pos)
                                                                        : 0;
                                                                mschange = '+' + mschange;
                                                                sumtime += time;
                                                                const change = bonus / currBonus;
                                                                if (pos === 13) {
                                                                        hackhacktime = time;
                                                                        hackhackchange = change < 1
                                                                                ? 1
                                                                                : change;
                                                                }
                                                                return <tr key={pos}>
                                                                        <td>{hack[0]}</td>
                                                                        <td>
                                                                                <label>
                                                                                        <input style={{
                                                                                                        width: '40px',
                                                                                                        margin: '5px'
                                                                                                }} type="number" step="any" value={reducer} onFocus={this.handleFocus} onChange={(e) => this.handleChange(e, 'reducer', pos)}/>
                                                                                </label>
                                                                        </td>
                                                                        <td>
                                                                                <label>
                                                                                        <input style={{
                                                                                                        width: '60px',
                                                                                                        margin: '5px'
                                                                                                }} type="number" step="any" value={level} onFocus={this.handleFocus} onChange={(e) => this.handleChange(e, 'level', pos)}/>
                                                                                </label>
                                                                        </td>
                                                                        <td>{shorten(currBonus, 2)}%</td>
                                                                        <td className={classTarget}>
                                                                                <label>
                                                                                        <input style={{
                                                                                                        width: '60px',
                                                                                                        margin: '5px'
                                                                                                }} type="number" step="any" value={target} onFocus={this.handleFocus} onChange={(e) => this.handleChange(e, 'goal', pos)}/>
                                                                                </label>
                                                                                <button type="button" onClick={(e) => this.handleChange(e, 'msdown', pos)}>
                                                                                        -
                                                                                </button>
                                                                                <button type="button" onClick={(e) => this.handleChange(e, 'msup', pos)}>
                                                                                        +
                                                                                </button>
                                                                        </td>
                                                                        <td className={classLevel}>{target}</td>
                                                                        <td className={classMS}>{target}</td>
                                                                        <td>{mschange}</td>
                                                                        <td>{to_time(time)}</td>
                                                                        <td>{shorten(bonus, 2)}%</td>
                                                                        <td>×{shorten(change, 3)}</td>
                                                                        <td>{to_time(timePastLevel)}</td>
                                                                        <td>{to_time(timePastTarget)}</td>
                                                                </tr>;
                                                        })
                                                }
                                                <tr>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                        <th className={classTarget}>{'Min total:'}<br/>{'' + to_time((sumtime - hackhacktime) / hackhackchange + hackhacktime)}</th>
                                                </tr>
                                                <tr>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                        <th className={classTarget}>{'Max total:'}<br/>{'' + to_time(sumtime)}</th>
                                                </tr>
                                        </tbody>
                                </table>
                        </form>
                </div>);
        };
}

export default HackComponent;
