import React from 'react';
import ReactDOM from 'react-dom';
import {createStore, applyMiddleware, compose} from 'redux';
import {Provider} from 'react-redux';
import createSagaMiddleware from 'redux-saga'

import AppReducer from './reducers';
import rootSaga from './sagas'

import './stylesheets/index.css';

import App from './containers/App';

import * as serviceWorker from './serviceWorker';

const sagaMiddleware = createSagaMiddleware();
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(AppReducer, composeEnhancers(applyMiddleware(sagaMiddleware)));
sagaMiddleware.run(rootSaga);/* inject our sagas into the middleware */

ReactDOM.render(<Provider store={store}>
        <App {...store.props}/>
</Provider>, document.getElementById('app'),);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
