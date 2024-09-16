import React, {Component} from 'react';
import {connect} from 'react-redux';
import ReactGA from 'react-ga';

import {default as AppLayout} from '../components/AppLayout/AppLayout';

import {AugmentAsync, AugmentSettings} from '../actions/Augment'
import {HackAsync} from '../actions/Hack'
import {WishAsync} from '../actions/Wish'
import {Go2Titan, Settings} from '../actions/Settings'
import {Crement} from '../actions/Crement'
import {DisableItem, DisableZone} from '../actions/DisableItem';
import {ToggleModal} from '../actions/ToggleModal';
import {EditItem} from '../actions/EditItem';
import {EditFactor} from '../actions/EditFactor';
import {EquipItem, EquipItems} from '../actions/EquipItem';
import {HideZone} from '../actions/HideZone'
import {LockItem} from '../actions/LockItem'
import {OptimizeGearAsync} from '../actions/OptimizeGear';
import {OptimizeSavesAsync} from '../actions/OptimizeSaves';
import {Terminate} from '../actions/Terminate'
import {Undo} from '../actions/Undo'
import {UnequipItem} from '../actions/UnequipItem';
import {DeleteSlot} from '../actions/DeleteSlot'
import {LoadFactors, LoadSlot} from '../actions/LoadSlot'
import {SaveName, SaveSlot} from '../actions/SaveSlot'
import {ToggleSaved, ToggleUnused} from '../actions/ToggleSaved'
import {LoadStateLocalStorage} from '../actions/LoadStateLocalStorage';
import {SaveStateLocalStorage} from '../actions/SaveStateLocalStorage';

import '../stylesheets/App.css';
import {DropEquipItem} from '../actions/DropEquipItem';

ReactGA.initialize('UA-141463995-1');

class App extends Component {
    componentDidMount = () => {
        this.props.handleLoadStateLocalStorage();
        window.appHandlers = this.props;
    }
    componentDidUpdate = () => this.props.handleSaveStateLocalStorage(this.props);

    render() {
        return <AppLayout {...this.props}/>;
    }
}

const mapStateToProps = state => {
    window.appState = state.optimizer;
    return {
        itemdata: state.optimizer.itemdata,
        items: state.optimizer.items,
        offhand: state.optimizer.offhand,
        equip: state.optimizer.equip,
        locked: state.optimizer.locked,
        lastequip: state.optimizer.lastequip,
        savedequip: state.optimizer.savedequip,
        savedidx: state.optimizer.savedidx,
        maxsavedidx: state.optimizer.maxsavedidx,
        showsaved: state.optimizer.showsaved,
        showunused: state.optimizer.showunused,
        editItem: state.optimizer.editItem,
        ignoreDisabled: state.optimizer.ignoreDisabled,
        factors: state.optimizer.factors,
        maxslots: state.optimizer.maxslots,
        running: state.optimizer.running,
        zone: state.optimizer.zone,
        titanversion: state.optimizer.titanversion,
        looty: state.optimizer.looty,
        pendant: state.optimizer.pendant,
        hidden: state.optimizer.hidden,
        hidenotmaxed: state.optimizer.hidenotmaxed,
        hidedisabled: state.optimizer.hidedisabled,
        compactbonus: state.optimizer.compactbonus,
        compactitemlist: state.optimizer.compactitemlist,
        augstats: state.optimizer.augstats,
        basestats: state.optimizer.basestats,
        capstats: state.optimizer.capstats,
        cubestats: state.optimizer.cubestats,
        ngustats: state.optimizer.ngustats,
        hackstats: state.optimizer.hackstats,
        wishstats: state.optimizer.wishstats,
        version: state.optimizer.version,
        loaded: state.optimizer.loaded
    }
}

const mapDispatchToProps = {
    handleCrement: Crement,
    handleDisableItem: DisableItem,
    handleToggleModal: ToggleModal,
    handleEditItem: EditItem,
    handleLockItem: LockItem,
    handleEditFactor: EditFactor,
    handleEquipItem: EquipItem,
    handleEquipItems: EquipItems,
    handleDisableZone: DisableZone,
    handleHideZone: HideZone,
    handleOptimizeGear: OptimizeGearAsync,
    handleOptimizeSaves: OptimizeSavesAsync,
    handleTerminate: Terminate,
    handleUndo: Undo,
    handleUnequipItem: UnequipItem,
    handleDropEquipItem: DropEquipItem,
    handleDeleteSlot: DeleteSlot,
    handleLoadFactors: LoadFactors,
    handleLoadSlot: LoadSlot,
    handleSaveName: SaveName,
    handleSaveSlot: SaveSlot,
    handleToggleSaved: ToggleSaved,
    handleToggleUnused: ToggleUnused,
    handleAugmentSettings: AugmentSettings,
    handleAugmentAsync: AugmentAsync,
    handleHackAsync: HackAsync,
    handleWishAsync: WishAsync,
    handleSettings: Settings,
    handleGo2Titan: Go2Titan,
    handleSaveStateLocalStorage: SaveStateLocalStorage,
    handleLoadStateLocalStorage: LoadStateLocalStorage
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
