import React, {Component} from 'react';
import ReactTooltip from 'react-tooltip'
import Modal from 'react-modal';
import ReactGA from 'react-ga';
import {Redirect} from 'react-router-dom'

import {get_max_titan, get_max_zone, get_zone} from '../../util';
import {LOOTIES, PENDANTS} from '../../assets/Items';

import {default as Crement} from '../Crement/Crement';
import {default as ItemTable} from '../ItemTable/ItemTable';
import {default as EquipTable} from '../ItemTable/EquipTable';
import {default as OptimizeButton} from '../OptimizeButton/OptimizeButton';
import {default as FactorForm} from '../FactorForm/FactorForm';
import {default as ItemForm} from '../ItemForm/ItemForm';

import './Optimizer.css';

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)'
    }
};

Modal.setAppElement('#app');

class Optimizer extends Component {

    constructor(props) {
        super(props);
        this.fresh = true;
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
        if (val < 0) {
            val = 0;
        }
        let stats = {
            ...this.props[name[0] + 'stats'],
            [name[1]]: val
        };
        if (name[0] === 'cube') {
            stats = this.cubeTier(stats, name[1]);
        }
        this.props.handleSettings(name[0] + 'stats', stats);

    }

    cubeTier(cubestats, name) {
        const power = Number(cubestats.power);
        const toughness = Number(cubestats.toughness);
        let tier = Number(cubestats.tier)
        if (name !== 'tier') {
            tier = Math.floor(Math.log10(power + toughness) - 1);
        }
        tier = Math.max(0, tier);
        return {
            ...cubestats,
            tier: tier
        };
    }

    closeEditModal = () => (this.props.handleToggleModal('edit item', {
        itemId: undefined,
        lockable: false,
        on: false
    }));

    render() {
        //HACK: no idea how to do this properly
        if (!this.props.loaded) {
            return <div/>;
        }
        if (this.props.loadLoadout === undefined) {
            ReactGA.pageview('/gear-optimizer/');
        } else {
            if (this.fresh) {
                const loadout = this.props.loadLoadout;
                this.props.handleEquipItems(loadout);
                this.fresh = false;
            } else {
                return <Redirect to='/'/>
            }
        }
        // render the actual optimizer tab
        const zone = get_zone(this.props.zone);
        console.log(this.props.zone, zone)
        const maxzone = get_max_zone(this.props.zone);
        const maxtitan = get_max_titan(this.props.zone);
        const accslots = this.props.equip.accessory.length;
        const looty = this.props.looty >= 0
            ? LOOTIES[this.props.looty]
            : 'None';
        const pendant = this.props.pendant >= 0
            ? PENDANTS[this.props.pendant]
            : 'None';
        return (<div className={this.props.className}>
            <div className="content__container">
                <div className='button-section' key='slots'>
                    <button type="button" onClick={() => this.props.handleGo2Titan(8, 3, 5, 12)}>
                        {'Titan 8 Preset'}
                    </button>
                    <button type="button" onClick={() => this.props.handleGo2Titan(11, 6, 8, 15)}>
                        {'Titan 11 Preset'}
                    </button>
                    <div><Crement header='Highest zone' value={zone[0]} name='zone'
                                  handleClick={this.props.handleCrement} min={2} max={maxzone}/></div>
                    {
                        this.props.zone > 20
                            ? <div><Crement header={maxtitan[0] + ' version'} value={this.props.titanversion}
                                            name='titanversion' handleClick={this.props.handleCrement} min={1} max={4}/>
                            </div>
                            : ''
                    }
                    <div><Crement header='Highest looty' value={looty} name='looty'
                                  handleClick={this.props.handleCrement} min={-1} max={LOOTIES.length - 1}/></div>
                    <div><Crement header='Highest pendant' value={pendant} name='pendant'
                                  handleClick={this.props.handleCrement} min={-1} max={PENDANTS.length - 1}/></div>
                    <div><Crement header='Accessory slots' value={accslots} name='accslots'
                                  handleClick={this.props.handleCrement} min={0} max={100}/></div>
                    {
                        this.props.zone > 27
                            ? <div><Crement header='Offhand power' value={this.props.offhand * 5 + '%'} name='offhand'
                                            handleClick={this.props.handleCrement} min={0} max={20}/></div>
                            : ''
                    }
                </div>
                <div className='button-section' key='factorforms'>
                    <OptimizeButton text={'Gear'} running={this.props.running} abort={this.props.handleTerminate}
                                    optimize={this.props.handleOptimizeGear}/>{' '}
                    <button onClick={this.props.handleUndo}>
                        {'Load previous'}
                    </button>
                    {[...this.props.factors.keys()].map((idx) => (
                        <div key={'factorform' + idx}><FactorForm {...this.props} idx={idx}/></div>))}
                </div>
                <div className='button-section' key='numberforms'>
                    <table className='center cubetable'>
                        <tbody>
                        <tr>
                            <td>Allow disabled items</td>
                            <td>
                                <input type="checkbox" checked={this.props.ignoreDisabled}
                                       onChange={() => this.props.handleSettings('ignoreDisabled', !this.props.ignoreDisabled)}/>
                            </td>
                        </tr>
                        <tr>
                            <td>P/T input</td>
                            <td>
                                <input type="checkbox" checked={this.props.basestats.modifiers}
                                       onChange={(e) => this.props.handleSettings('basestats', {
                                           ...this.props.basestats,
                                           modifiers: !this.props.basestats.modifiers
                                       })}/></td>
                        </tr>
                        {
                            ['power', 'toughness'].map((statname, idx) => (<tr className={this.props.basestats.modifiers
                                ? ''
                                : 'hide'} key={statname}>
                                <td>{'Base ' + statname.charAt(0).toUpperCase() + statname.slice(1)}
                                </td>
                                <td>
                                    <label>
                                        <input style={{
                                            width: '9ch',
                                            margin: '1ch'
                                        }} type="number" step="any" value={this.props.basestats[statname]}
                                               onFocus={this.handleFocus}
                                               onChange={(e) => this.handleChange(e, ['base', statname])}/>
                                    </label>
                                </td>
                            </tr>))
                        }
                        {
                            ['power', 'toughness', 'tier'].map((statname, idx) => (
                                <tr className={this.props.basestats.modifiers || statname === 'tier'
                                    ? ''
                                    : 'hide'} key={statname}>
                                    <td>{'Cube ' + statname.charAt(0).toUpperCase() + statname.slice(1)}
                                    </td>
                                    <td>
                                        <label>
                                            <input style={{
                                                width: '9ch',
                                                margin: '1ch'
                                            }} type="number" step="any" value={this.props.cubestats[statname]}
                                                   onFocus={this.handleFocus}
                                                   onChange={(e) => this.handleChange(e, ['cube', statname])}/>
                                        </label>
                                    </td>
                                </tr>))
                        }
                        <tr>
                            <td>Hardcap input</td>
                            <td>
                                <input type="checkbox" checked={this.props.capstats.modifiers}
                                       onChange={(e) => this.props.handleSettings('capstats', {
                                           ...this.props.capstats,
                                           modifiers: !this.props.capstats.modifiers
                                       })}/>
                            </td>
                        </tr>
                        {
                            Object.getOwnPropertyNames(this.props.capstats).map((statname, idx) => {
                                if (statname.slice(0, 4) !== 'Nude') {
                                    return null;
                                }
                                return (<tr className={this.props.capstats.modifiers
                                    ? ''
                                    : 'hide'} key={statname}>
                                    <td>{statname}
                                    </td>
                                    <td>
                                        <label>
                                            <input style={{
                                                width: '9ch',
                                                margin: '1ch'
                                            }} type="number" step="any" value={this.props.capstats[statname]}
                                                   onFocus={this.handleFocus}
                                                   onChange={(e) => this.handleChange(e, ['cap', statname])}/>
                                        </label>
                                    </td>
                                </tr>);
                            })
                        }
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="content__container">
                <EquipTable {...this.props} group={'slot'} type='equip' handleClickItem={this.props.handleUnequipItem}
                            handleCtrlClickItem={this.props.handleDisableItem}
                            handleRightClickItem={(itemId, lockable) => this.props.handleToggleModal('edit item', {
                                itemId: itemId,
                                lockable: lockable,
                                on: true
                            })}/>
                <ItemTable {...this.props} maxtitan={maxtitan} group={'zone'} type='items'
                           handleClickItem={this.props.handleEquipItem}
                           handleCtrlClickItem={this.props.handleDisableItem}
                           handleRightClickItem={(itemId) => this.props.handleToggleModal('edit item', {
                               itemId: itemId,
                               lockable: false,
                               on: true
                           })}/>
            </div>
            <Modal className='edit-item-modal' overlayClassName='edit-item-overlay' isOpen={this.props.editItem[0]}
                   onAfterOpen={undefined} onRequestClose={this.closeEditModal} style={customStyles}
                   contentLabel='Item Edit Modal' autoFocus={false}>
                <ItemForm {...this.props} closeEditModal={this.closeEditModal}/>
            </Modal>
            <ReactTooltip multiline={true}/>
        </div>);

    };
}

export default Optimizer;
