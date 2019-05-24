import {combineReducers} from 'redux';

import ItemsReducer from './Items';

const AppReducer = combineReducers({todos: ItemsReducer});

export default AppReducer;
