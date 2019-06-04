import React, {Component} from 'react';
import {connect} from 'react-redux';

import {default as AppLayout} from '../components/AppLayout/AppLayout';

import {Crement} from '../actions/Crement'
import {DisableItem} from '../actions/DisableItem';
import {ToggleEdit} from '../actions/ToggleEdit';
import {EditItem} from '../actions/EditItem';
import {EditFactor} from '../actions/EditFactor';
import {EquipItem} from '../actions/EquipItem';
import {HideZone} from '../actions/HideZone'
import {OptimizeGearAsync} from '../actions/OptimizeGear';
import {Terminate} from '../actions/Terminate'
import {Undo} from '../actions/Undo'
import {UnequipItem} from '../actions/UnequipItem';
import {DeleteSlot} from '../actions/DeleteSlot'
import {LoadSlot} from '../actions/LoadSlot'
import {SaveSlot} from '../actions/SaveSlot'
import {ToggleSaved} from '../actions/ToggleSaved'
import {LoadStateLocalStorage} from '../actions/LoadStateLocalStorage';
import {SaveStateLocalStorage} from '../actions/SaveStateLocalStorage';

import '../stylesheets/App.css';

class App extends Component {
        componentDidMount = () => this.props.handleLoadStateLocalStorage();
        componentDidUpdate = () => this.props.handleSaveStateLocalStorage(this.props);

        render() {
                return <AppLayout {...this.props}/>;
        }
}

const mapStateToProps = state => ({
        items: state.optimizer.items,
        equip: state.optimizer.equip,
        lastequip: state.optimizer.lastequip,
        savedequip: state.optimizer.savedequip,
        savedidx: state.optimizer.savedidx,
        maxsavedidx: state.optimizer.maxsavedidx,
        showsaved: state.optimizer.showsaved,
        accslots: state.optimizer.accslots,
        editItem: state.optimizer.editItem,
        factors: state.optimizer.factors,
        maxslots: state.optimizer.maxslots,
        running: state.optimizer.running,
        zone: state.optimizer.zone,
        titanversion: state.optimizer.titanversion,
        hidden: state.optimizer.hidden,
        version: state.optimizer.version
});

const mapDispatchToProps = {
        handleCrement: Crement,
        handleDisableItem: DisableItem,
        handleToggleEdit: ToggleEdit,
        handleEditItem: EditItem,
        handleEditFactor: EditFactor,
        handleEquipItem: EquipItem,
        handleHideZone: HideZone,
        handleOptimizeGear: OptimizeGearAsync,
        handleTerminate: Terminate,
        handleUndo: Undo,
        handleUnequipItem: UnequipItem,
        handleDeleteSlot: DeleteSlot,
        handleLoadSlot: LoadSlot,
        handleSaveSlot: SaveSlot,
        handleToggleSaved: ToggleSaved,
        handleSaveStateLocalStorage: SaveStateLocalStorage,
        handleLoadStateLocalStorage: LoadStateLocalStorage
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
