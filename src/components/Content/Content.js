import React, {Component} from 'react';
import Modal from 'react-modal';

import PropTypes from 'prop-types';
import {default as Crement} from '../Crement/Crement';
import {default as ItemTable} from '../ItemTable/ItemTable';
import {default as EquipTable} from '../ItemTable/EquipTable';
import {default as OptimizeButton} from '../OptimizeButton/OptimizeButton';
import {default as FactorForm} from '../FactorForm/FactorForm'
import {default as ItemForm} from '../ItemForm/ItemForm'

import './Content.css';

function do_nothing() {}

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

class Content extends Component {
        static propTypes = {
                className: PropTypes.string.isRequired
        };

        static defaultProps = {
                items: [],
                equip: [],
                accslots: 0,
                respawn: 0
        };

        closeEditModal = () => (this.props.handleToggleEdit(undefined, false));

        render() {
                return (<div className={this.props.className}>
                        <div className="content__container">
                                <div className='button-section' key='slots'>
                                        <Crement header='Accessory slots' value={this.props.accslots} name='accslots' handleClick={this.props.handleCrement} min={0} max={100}/>
                                        <Crement header='Force respawn items' value={this.props.respawn} name='respawn' handleClick={this.props.handleCrement} min={0} max={this.props.accslots}/>
                                        <Crement header='Force daycare items' value={this.props.daycare} name='daycare' handleClick={this.props.handleCrement} min={0} max={this.props.accslots}/>
                                        <OptimizeButton {...this.props} handleClick={this.props.handleOptimizeGear}/>
                                </div>
                                <div className='button-section' key='factorforms'>
                                        {[...this.props.factors.keys()].map((idx) => (<div key={'factorform' + idx}><FactorForm {...this.props} idx={idx}/></div>))}
                                </div>
                        </div>
                        <div className="content__container">
                                <EquipTable {...this.props} group={'slot'} type='equip' handleClickItem={this.props.handleUnequipItem} handleRightClickItem={this.props.handleToggleEdit} handleDoubleClickItem={do_nothing}/>
                                <ItemTable {...this.props} group={'zone'} type='items' handleClickItem={this.props.handleDisableItem} handleRightClickItem={this.props.handleToggleEdit} handleDoubleClickItem={this.props.handleEquipItem}/>
                        </div>
                        <Modal isOpen={this.props.editItem[0]} onAfterOpen={this.afterOpenModal} onRequestClose={this.closeEditModal} style={customStyles} contentLabel="Example Modal">
                                <ItemForm {...this.props} closeEditModal={this.closeEditModal}/>
                        </Modal>
                </div>);

        };
}

export default Content;
