import React, {Component} from 'react';
import {connect} from 'react-redux';

import {default as AppLayout} from '../components/AppLayout/AppLayout';

import {Crement} from '../actions/Crement'
import {DisableItem} from '../actions/DisableItem';
import {EquipItem} from '../actions/EquipItem';
import {OptimizeGear} from '../actions/OptimizeGear';
import {UnequipItem} from '../actions/UnequipItem';
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

const mapStateToProps = state => ({items: state.optimizer.items, equip: state.optimizer.equip, accslots: state.optimizer.accslots, respawn: state.optimizer.respawn});

const mapDispatchToProps = {
        handleCrement: Crement,
        handleDisableItem: DisableItem,
        handleEquipItem: EquipItem,
        handleOptimizeGear: OptimizeGear,
        handleUnequipItem: UnequipItem,
        handleSaveStateLocalStorage: SaveStateLocalStorage,
        handleLoadStateLocalStorage: LoadStateLocalStorage
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
