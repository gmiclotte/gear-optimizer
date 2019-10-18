import React, {Component} from 'react';
import Modal from 'react-modal';
import ReactGA from 'react-ga';

import {get_zone, get_max_zone, get_max_titan} from '../../util';
import {LOOTIES, PENDANTS} from '../../assets/Items'

import {default as Crement} from '../Crement/Crement';
import {default as ItemTable} from '../ItemTable/ItemTable';
import {default as EquipTable} from '../ItemTable/EquipTable';
import {default as OptimizeButton} from '../OptimizeButton/OptimizeButton';
import {default as FactorForm} from '../FactorForm/FactorForm'
import {default as ItemForm} from '../ItemForm/ItemForm'

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
                return;
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

        closeEditModal = () => (this.props.handleToggleEdit(undefined, false, false));

        render() {
                ReactGA.pageview('/gear-optimizer/');
                const zone = get_zone(this.props.zone);
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
                                        <div><Crement header='Highest zone' value={zone[0]} name='zone' handleClick={this.props.handleCrement} min={2} max={maxzone}/></div>
                                        {
                                                this.props.zone > 20
                                                        ? <div><Crement header={maxtitan[0] + ' version'} value={this.props.titanversion} name='titanversion' handleClick={this.props.handleCrement} min={1} max={4}/></div>
                                                        : ''
                                        }
                                        <div><Crement header='Highest looty' value={looty} name='looty' handleClick={this.props.handleCrement} min={-1} max={LOOTIES.length - 1}/></div>
                                        <div><Crement header='Highest pendant' value={pendant} name='pendant' handleClick={this.props.handleCrement} min={-1} max={PENDANTS.length - 1}/></div>
                                        <div><Crement header='Accessory slots' value={accslots} name='accslots' handleClick={this.props.handleCrement} min={0} max={100}/></div>
                                        <div><Crement header='Offhand power' value={this.props.offhand * 5 + '%'} name='offhand' handleClick={this.props.handleCrement} min={0} max={20}/></div>
                                </div>
                                <div className='button-section' key='factorforms'>
                                        <OptimizeButton text={'Gear'} running={this.props.running} abort={this.props.handleTerminate} optimize={this.props.handleOptimizeGear}/>{' '}
                                        <button onClick={this.props.handleUndo}>
                                                {'Load previous'}
                                        </button>
                                        {[...this.props.factors.keys()].map((idx) => (<div key={'factorform' + idx}><FactorForm {...this.props} idx={idx}/></div>))}
                                </div>
                                <div className='button-section' key='numberforms'>
                                        <table className='center cubetable'>
                                                <tbody>
                                                        <tr>
                                                                <td>Base Power
                                                                </td>
                                                                <td>
                                                                        <label>
                                                                                <input style={{
                                                                                                width: '100px',
                                                                                                margin: '5px'
                                                                                        }} type="number" step="any" value={this.props.basestats['power']} onFocus={this.handleFocus} onChange={(e) => this.handleChange(e, ['base', 'power'])}/>
                                                                        </label>
                                                                </td>
                                                        </tr>
                                                        <tr>
                                                                <td>Base Toughness
                                                                </td>
                                                                <td>
                                                                        <label>
                                                                                <input style={{
                                                                                                width: '100px',
                                                                                                margin: '5px'
                                                                                        }} type="number" step="any" value={this.props.basestats['toughness']} onFocus={this.handleFocus} onChange={(e) => this.handleChange(e, ['base', 'toughness'])}/>
                                                                        </label>
                                                                </td>
                                                        </tr>
                                                        <tr>
                                                                <td>Cube Power
                                                                </td>
                                                                <td>
                                                                        <label>
                                                                                <input style={{
                                                                                                width: '100px',
                                                                                                margin: '5px'
                                                                                        }} type="number" step="any" value={this.props.cubestats['power']} onFocus={this.handleFocus} onChange={(e) => this.handleChange(e, ['cube', 'power'])}/>
                                                                        </label>
                                                                </td>
                                                        </tr>
                                                        <tr>
                                                                <td>Cube Toughness
                                                                </td>
                                                                <td>
                                                                        <label>
                                                                                <input style={{
                                                                                                width: '100px',
                                                                                                margin: '5px'
                                                                                        }} type="number" step="any" value={this.props.cubestats['toughness']} onFocus={this.handleFocus} onChange={(e) => this.handleChange(e, ['cube', 'toughness'])}/>
                                                                        </label>
                                                                </td>
                                                        </tr>
                                                        <tr>
                                                                <td>Cube Tier
                                                                </td>
                                                                <td>
                                                                        <label>
                                                                                <input style={{
                                                                                                width: '100px',
                                                                                                margin: '5px'
                                                                                        }} type="number" step="any" value={this.props.cubestats['tier']} onFocus={this.handleFocus} onChange={(e) => this.handleChange(e, ['cube', 'tier'])}/>
                                                                        </label>
                                                                </td>
                                                        </tr>
                                                        <tr>
                                                                <td>E Cap Gear
                                                                </td>
                                                                <td>
                                                                        <label>
                                                                                <input style={{
                                                                                                width: '100px',
                                                                                                margin: '5px'
                                                                                        }} type="number" step="any" value={this.props.capstats['Energy Cap Gear']} onFocus={this.handleFocus} onChange={(e) => this.handleChange(e, ['cap', 'Energy Cap Gear'])}/>
                                                                        </label>
                                                                </td>
                                                        </tr>
                                                        <tr>
                                                                <td>Total E Cap
                                                                </td>
                                                                <td>
                                                                        <label>
                                                                                <input style={{
                                                                                                width: '100px',
                                                                                                margin: '5px'
                                                                                        }} type="number" step="any" value={this.props.capstats['Energy Cap Total']} onFocus={this.handleFocus} onChange={(e) => this.handleChange(e, ['cap', 'Energy Cap Total'])}/>
                                                                        </label>
                                                                </td>
                                                        </tr>
                                                        <tr>
                                                                <td>M Cap Gear
                                                                </td>
                                                                <td>
                                                                        <label>
                                                                                <input style={{
                                                                                                width: '100px',
                                                                                                margin: '5px'
                                                                                        }} type="number" step="any" value={this.props.capstats['Magic Cap Gear']} onFocus={this.handleFocus} onChange={(e) => this.handleChange(e, ['cap', 'Magic Cap Gear'])}/>
                                                                        </label>
                                                                </td>
                                                        </tr>
                                                        <tr>
                                                                <td>Total M Cap
                                                                </td>
                                                                <td>
                                                                        <label>
                                                                                <input style={{
                                                                                                width: '100px',
                                                                                                margin: '5px'
                                                                                        }} type="number" step="any" value={this.props.capstats['Magic Cap Total']} onFocus={this.handleFocus} onChange={(e) => this.handleChange(e, ['cap', 'Magic Cap Total'])}/>
                                                                        </label>
                                                                </td>
                                                        </tr>
                                                </tbody>
                                        </table>
                                </div>
                        </div>
                        <div className="content__container">
                                <EquipTable {...this.props} group={'slot'} type='equip' handleClickItem={this.props.handleUnequipItem} handleRightClickItem={this.props.handleToggleEdit}/>
                                <ItemTable {...this.props} maxtitan={maxtitan} group={'zone'} type='items' handleClickItem={this.props.handleEquipItem} handleRightClickItem={this.props.handleToggleEdit}/>
                        </div>
                        <Modal className='edit-item-modal' overlayClassName='edit-item-overlay' isOpen={this.props.editItem[0]} onAfterOpen={this.afterOpenModal} onRequestClose={this.closeEditModal} style={customStyles} contentLabel='Item Edit Modal' autoFocus={false}>
                                <ItemForm {...this.props} closeEditModal={this.closeEditModal}/>
                        </Modal>
                </div>);

        };
}

export default Optimizer;
