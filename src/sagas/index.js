import {put, select, takeEvery, all} from 'redux-saga/effects'

import {OPTIMIZE_GEAR_ASYNC, OPTIMIZE_GEAR} from '../actions/OptimizeGear'
import {OPTIMIZING_GEAR} from '../actions/OptimizingGear'
import {TERMINATE_ASYNC, TERMINATE} from '../actions/Terminate'

/* eslint-disable-next-line */
import Worker from './optimize.worker'
let worker;

const doOptimize = (state, worker) => new Promise(async function(resolve, reject) {
        let output = await new Promise(function(resolve, reject) {
                worker.onmessage = function(e) {
                        resolve(e.data);
                };
                worker.postMessage({state: state});
        });
        await resolve(output.equip);
})

export function* optimizeAsync() {
        worker = new Worker();
        yield put({
                type: OPTIMIZING_GEAR,
                payload: {
                        worker: worker
                }
        });
        const store = yield select();
        const state = store.optimizer;
        let equip = yield doOptimize(state, worker);
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

export function* terminate() {
        worker.terminate();
        yield put({type: TERMINATE});
}

export function* watchTerminate() {
        yield takeEvery(TERMINATE_ASYNC, terminate);
}

export default function* rootSaga() {
        yield all([watchOptimizeAsync(), watchTerminate()]);
}
