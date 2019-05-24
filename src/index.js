import React from 'react';
import ReactDOM from 'react-dom';
import {createStore} from 'redux';
import {Provider} from 'react-redux';
import AppReducer from './reducers';

import './stylesheets/index.css';

import App from './containers/App';

import * as serviceWorker from './serviceWorker';

const store = createStore(AppReducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),);

ReactDOM.render(<Provider store={store}>
        <App {...store.props}/>
</Provider>, document.getElementById('app'),);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
