import React, {Component} from 'react';
import Modal from 'react-modal';
import ReactGA from 'react-ga';

import {get_zone, get_max_zone, get_max_titan} from '../../util';
import {LOOTIES, PENDANTS} from '../../assets/Items'

import PropTypes from 'prop-types';
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
        static propTypes = {
                className: PropTypes.string.isRequired
        };

        static defaultProps = {
                items: [],
                equip: []
        };

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
                                        <div><Crement header='Highest zone' value={zone[0]} name='zone' handleClick={this.props.handleCrement} min={1} max={maxzone}/></div>
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
                                        <OptimizeButton fast={false} running={this.props.running} abort={this.props.handleTerminate} optimize={this.props.handleOptimizeGear}/>{' '}
                                        <OptimizeButton fast={true} running={this.props.running} abort={this.props.handleTerminate} optimize={this.props.handleOptimizeGear}/>{' '}
                                        <button onClick={this.props.handleUndo}>
                                                {'Load previous'}
                                        </button>
                                        {[...this.props.factors.keys()].map((idx) => (<div key={'factorform' + idx}><FactorForm {...this.props} idx={idx}/></div>))}
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
