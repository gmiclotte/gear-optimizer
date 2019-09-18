import React, {Component} from 'react';
import ReactGA from 'react-ga';
import {Hack} from '../../Hack';
import {Hacks} from '../../assets/ItemAux';

class HackComponent extends Component {
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
                let hackstats = {
                        ...this.props.hackstats
                };
                if (idx < 0) {
                        hackstats = {
                                ...hackstats,
                                [name]: val
                        };
                        this.props.handleHackSettings(hackstats);
                        return;
                }
                let hacks = [...hackstats.hacks];
                let hack = {
                        ...hacks[idx],
                        [name]: val
                };
                hack.goal = this.goallevel(hack);
                hack.start = this.startlevel(hack);
                hacks[idx] = hack;
                hackstats = {
                        ...hackstats,
                        hacks: hacks
                };
                this.props.handleHackSettings(hackstats);
                return;
        }

        render() {
                ReactGA.pageview('/hacks/');
                const vals = this.props.augment.vals;
                let text = 'Hack calculator, coming soon.';
                return (<div className='center'>
                        <div>{text}</div>
                        <form onSubmit={this.handleSubmit}>
                                <div>
                                        <label >
                                                {'R power'}
                                                <input style={{
                                                                width: '100px',
                                                                margin: '5px'
                                                }} type="number" value={this.props.hackstats['rpow']} onChange={(e) => this.handleChange(e, 'rpow')}/>
                                        </label>
                                        <label >
                                                {' cap'}
                                                <input style={{
                                                                width: '100px',
                                                                margin: '5px'
                                                }} type="number" value={this.props.hackstats['rcap']} onChange={(e) => this.handleChange(e, 'rcap')}/>
                                        </label>
                                </div>
                                <label>
                                        {'hack speed modifier:'}
                                        <input style={{
                                                        width: '60px',
                                                        margin: '5px'
                                        }} type="number" value={this.props.hackstats.hackspeed} onChange={(e) => this.handleChange(e, 'hackspeed')} onFocus={this.handleFocus}/>
                                </label>
                                <br/>
                                <label>
                                        {'Hack time:'}
                                        <input style={{
                                                        width: '60px',
                                                        margin: '5px'
                                        }} type="number" value={this.props.hackstats.hacktime} onChange={(e) => this.handleChange(e, 'hacktime')} onFocus={this.handleFocus}/> {' minutes'}
                                </label>
                                {
                                        Hacks.map((hack, pos) => <div key={pos}>
                                                {hack[0]}
                                                <label>
                                                        {' Level:'}<input style={{
                                                                width: '30px',
                                                                margin: '5px'
                                                        }} type="number" value={this.props.hackstats.hacks[pos].level} onChange={(e) => this.handleChange(e, 'level', pos)} onFocus={this.handleFocus}/>
                                                </label>
                                                <label>
                                                        {' Target level:'}<input style={{
                                                        width: '30px',
                                                        margin: '5px'
                                                }} type="number" value={this.props.hackstats.hacks[pos].goal} onChange={(e) => this.handleChange(e, 'goal', pos)} onFocus={this.handleFocus}/>
                                                </label>
                                        </div>)
                                }
                        </form>
                        <br/>
                </div>);

        };
}

export default HackComponent;
