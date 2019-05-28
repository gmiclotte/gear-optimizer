import {combineReducers} from 'redux';

import ItemsReducer from './Items';

const AppReducer = combineReducers({optimizer: ItemsReducer});

export default AppReducer;
