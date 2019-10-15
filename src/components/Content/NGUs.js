import React, {Component} from 'react';
import ReactGA from 'react-ga';
import {NGU} from '../../NGU';
import {NGUs} from '../../assets/ItemAux';
import {shorten} from '../../util';

class NGUComponent extends Component {
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

        handleChange(event, name, idx = -1, isMagic = -1) {
                let val = event.target.value;
                let ngustats = {
                        ...this.props.ngustats
                };
                if (idx < 0 && isMagic < 0) {
                        if (name === 'e2n' || name === 's2e') {
                                ngustats = {
                                        ...ngustats,
                                        quirk: {
                                                ...ngustats.quirk,
                                                [name]: !this.props.ngustats.quirk[name]
                                        }
                                };
                                this.props.handleSettings('ngustats', ngustats);
                                return;
                        }
                        ngustats = {
                                ...ngustats,
                                [name]: val
                        };
                        this.props.handleSettings('ngustats', ngustats);
                        return;
                }
                const resource = isMagic === 1
                        ? 'magic'
                        : 'energy';
                if (idx < 0) {
                        ngustats = {
                                ...ngustats,
                                [resource]: {
                                        ...ngustats[resource],
                                        [name]: val
                                }
                        };
                        this.props.handleSettings('ngustats', ngustats);
                        return;
                }
                let ngus = {
                        ...ngustats[resource].ngus
                };
                let ngu = {
                        ...ngus[idx],
                        [name]: val
                };
                ngus[idx] = ngu;
                ngustats = {
                        ...ngustats,
                        [resource]: {
                                ...ngustats[resource],
                                ngus: ngus
                        }
                };
                this.props.handleSettings('ngustats', ngustats);
                return;
        }

        render() {
                ReactGA.pageview('/ngus/');
                let nguOptimizer = new NGU(this.props.ngustats);
                const energy = this.props.ngustats.energy;
                const magic = this.props.ngustats.magic;
                const ngutime = this.props.ngustats.ngutime;
                return (<div className='center'>
                        <form onSubmit={this.handleSubmit}>
                                <table className='center'>
                                        <tbody>
                                                <tr>
                                                        <td>{'Energy cap'}</td>
                                                        <td>
                                                                <label >
                                                                        <input style={{
                                                                                        width: '100px',
                                                                                        margin: '5px'
                                                                                }} type="number" step="any" value={energy.cap} onFocus={this.handleFocus} onChange={(e) => this.handleChange(e, 'cap', -1, 0)}/>
                                                                </label>
                                                        </td>
                                                        <td>{'Energy NGU speed'}</td>
                                                        <td>
                                                                <label>
                                                                        <input style={{
                                                                                        width: '100px',
                                                                                        margin: '5px'
                                                                                }} type="number" step="any" value={energy.nguspeed} onFocus={this.handleFocus} onChange={(e) => this.handleChange(e, 'nguspeed', -1, 0)}/>
                                                                </label>
                                                        </td>
                                                </tr>
                                                <tr>
                                                        <td>{'Magic cap'}</td>
                                                        <td>
                                                                <label >
                                                                        <input style={{
                                                                                        width: '100px',
                                                                                        margin: '5px'
                                                                                }} type="number" step="any" value={magic.cap} onFocus={this.handleFocus} onChange={(e) => this.handleChange(e, 'cap', -1, 1)}/>
                                                                </label>
                                                        </td>
                                                        <td>{'Magic NGU speed'}</td>
                                                        <td>
                                                                <label>
                                                                        <input style={{
                                                                                        width: '100px',
                                                                                        margin: '5px'
                                                                                }} type="number" step="any" value={magic.nguspeed} onFocus={this.handleFocus} onChange={(e) => this.handleChange(e, 'nguspeed', -1, 1)}/>
                                                                </label>
                                                        </td>
                                                </tr>
                                                <tr>
                                                        <td>{'NGU time (minutes)'}</td>
                                                        <td>
                                                                <label>
                                                                        <input style={{
                                                                                        width: '100px',
                                                                                        margin: '5px'
                                                                                }} type="number" step="any" value={ngutime} onFocus={this.handleFocus} onChange={(e) => this.handleChange(e, 'ngutime')}/>
                                                                </label>
                                                        </td>
                                                </tr>
                                                <tr>
                                                        <td>{'Evil -> Normal Quirk'}</td>
                                                        <td>
                                                                <label>
                                                                        <input type="checkbox" checked={this.props.ngustats.quirk.e2n} onChange={(e) => this.handleChange(e, 'e2n')}/>
                                                                </label>
                                                        </td>
                                                        <td>{'Sadistic -> Evil Quirk'}</td>
                                                        <td>
                                                                <label>
                                                                        <input type="checkbox" checked={this.props.ngustats.quirk.s2e} onChange={(e) => this.handleChange(e, 's2e')}/>
                                                                </label>
                                                        </td>
                                                </tr>
                                        </tbody>
                                </table>
                                <table className='center'>
                                        <tbody>
                                                <tr>
                                                        <th></th>
                                                        <th>Normal Level</th>
                                                        <th>Evil Level</th>
                                                        <th>Sadistic Level</th>
                                                        <th>Current<br/>Bonus</th>
                                                        <th>Reachable<br/>Normal Level<br/>(Bonus Change)</th>
                                                        <th>Reachable<br/>Evil Level<br/>(Bonus Change)</th>
                                                        <th>Reachable<br/>Sadistic Level<br/>(Bonus Change)</th>
                                                </tr>
                                                {
                                                        ['energy', '', 'magic'].map((resource, resourceIdx) => {
                                                                if (resourceIdx === 1) {
                                                                        return <tr key={'whitespace'}>
                                                                                <th><br/></th>
                                                                        </tr>;
                                                                }
                                                                const isMagic = resourceIdx === 2
                                                                        ? 1
                                                                        : 0;
                                                                let stats = this.props.ngustats[resource].ngus;
                                                                return NGUs[resource].map((ngu, pos) => {
                                                                        const bonus = nguOptimizer.bonus(ngu, stats[pos]);
                                                                        const reachable = nguOptimizer.reachableBonus(stats[pos], ngutime, pos, isMagic, this.props.ngustats.quirk);
                                                                        return <tr key={pos}>
                                                                                <th>{ngu.name}</th>
                                                                                <td>
                                                                                        <label >
                                                                                                <input style={{
                                                                                                                width: '100px',
                                                                                                                margin: '5px'
                                                                                                        }} type="number" step="any" value={stats[pos].normal} onFocus={this.handleFocus} onChange={(e) => this.handleChange(e, 'normal', pos, isMagic)}/>
                                                                                        </label>
                                                                                </td>
                                                                                <td>
                                                                                        <label >
                                                                                                <input style={{
                                                                                                                width: '100px',
                                                                                                                margin: '5px'
                                                                                                        }} type="number" step="any" value={stats[pos].evil} onFocus={this.handleFocus} onChange={(e) => this.handleChange(e, 'evil', pos, isMagic)}/>
                                                                                        </label>
                                                                                </td>
                                                                                <td>
                                                                                        <label >
                                                                                                <input style={{
                                                                                                                width: '100px',
                                                                                                                margin: '5px'
                                                                                                        }} type="number" step="any" value={stats[pos].sadistic} onFocus={this.handleFocus} onChange={(e) => this.handleChange(e, 'sadistic', pos, isMagic)}/>
                                                                                        </label>
                                                                                </td>
                                                                                <td>{'×' + shorten(bonus * 100) + '%'}</td>
                                                                                <td>{shorten(reachable.level.normal) + ' (×' + shorten(reachable.bonus.normal / bonus, 4) + ')'}</td>
                                                                                <td>{shorten(reachable.level.evil) + ' (×' + shorten(reachable.bonus.evil / bonus, 4) + ')'}</td>
                                                                                <td>{shorten(reachable.level.sadistic) + ' (×' + shorten(reachable.bonus.sadistic / bonus, 4) + ')'}</td>
                                                                        </tr>;
                                                                });
                                                        })
                                                }
                                        </tbody>
                                </table>
                        </form>
                </div>);
        };
}

export default NGUComponent;
