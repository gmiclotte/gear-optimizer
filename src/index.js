import React from 'react';
import ReactDOM from 'react-dom';
import {createStore, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
import createSagaMiddleware from 'redux-saga'

import AppReducer from './reducers';
import rootSaga from './sagas'

import './stylesheets/index.css';

import App from './containers/App';

import * as serviceWorker from './serviceWorker';

const sagaMiddleware = createSagaMiddleware();
const store = createStore(AppReducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(), applyMiddleware(sagaMiddleware));
sagaMiddleware.run(rootSaga);/* inject our sagas into the middleware */

//const store = createStore(AppReducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),);

ReactDOM.render(<Provider store={store}>
        <App {...store.props}/>
</Provider>, document.getElementById('app'),);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
