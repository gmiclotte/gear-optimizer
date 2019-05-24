import React, {Component} from 'react';
import {connect} from 'react-redux'

import {default as AppLayout} from '../components/AppLayout/AppLayout';

import {EquipItem} from '../actions/EquipItem';
import {UnequipItem} from '../actions/UnequipItem';
import {LoadStateLocalStorage} from '../actions/LoadStateLocalStorage';
import {SaveStateLocalStorage} from '../actions/SaveStateLocalStorage';

import '../stylesheets/App.css';

class App extends Component {
        componentDidMount = () => this.props.handleLoadStateLocalStorage();
        componentDidUpdate = () => this.props.handleSaveStateLocalStorage(this.props.items);

        render() {
                return <AppLayout {...this.props}/>;
        }
}

const mapStateToProps = state => ({items: state.todos.items, equip: state.todos.equip});

const mapDispatchToProps = {
        handleEquipItem: EquipItem,
        handleUnequipItem: UnequipItem,
        handleSaveStateLocalStorage: SaveStateLocalStorage,
        handleLoadStateLocalStorage: LoadStateLocalStorage
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
