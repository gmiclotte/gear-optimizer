import {put, select, takeEvery, all} from 'redux-saga/effects'

import {AUGMENT_ASYNC, AUGMENT} from '../actions/Augment'
import {OPTIMIZE_GEAR_ASYNC, OPTIMIZE_GEAR} from '../actions/OptimizeGear'
import {OPTIMIZING_GEAR} from '../actions/OptimizingGear'
import {TERMINATE_ASYNC, TERMINATE} from '../actions/Terminate'

/* eslint-disable-next-line */
import Worker from './optimize.worker'
let worker;

const doOptimize = (state, worker, fast) => new Promise(async function(resolve, reject) {
        let output = await new Promise(function(resolve, reject) {
                worker.onmessage = function(e) {
                        resolve(e.data);
                };
                worker.postMessage({command: 'optimize', state: state, fast: fast});
        });
        await resolve(output.equip);
})

export function* optimizeAsync(action) {
        worker = new Worker();
        yield put({
                type: OPTIMIZING_GEAR,
                payload: {
                        worker: worker
                }
        });
        const store = yield select();
        const state = store.optimizer;
        let equip = yield doOptimize(state, worker, action.payload.fast);
        yield put({
                type: OPTIMIZE_GEAR,
                payload: {
                        equip: equip
                }
        });
}

export function* watchOptimizeAsync() {
        yield takeEvery(OPTIMIZE_GEAR_ASYNC, optimizeAsync)
}

const doAugment = (state, worker) => new Promise(async function(resolve, reject) {
        let output = await new Promise(function(resolve, reject) {
                worker.onmessage = function(e) {
                        resolve(e.data);
                };
                worker.postMessage({command: 'augment', state: state});
        });
        await resolve(output.vals);
})

export function* augmentAsync(action) {
        worker = new Worker();
        yield put({
                type: OPTIMIZING_GEAR,
                payload: {
                        worker: worker
                }
        });
        const store = yield select();
        const state = store.optimizer;
        let vals = yield doAugment(state, worker);
        yield put({
                type: AUGMENT,
                payload: {
                        vals: vals
                }
        });
}

export function* watchAugmentAsync() {
        yield takeEvery(AUGMENT_ASYNC, augmentAsync)
}

export function* terminate() {
        worker.terminate();
        yield put({type: TERMINATE});
}

export function* watchTerminate() {
        yield takeEvery(TERMINATE_ASYNC, terminate);
}

export default function* rootSaga() {
        yield all([watchOptimizeAsync(), watchAugmentAsync(), watchTerminate()]);
}
