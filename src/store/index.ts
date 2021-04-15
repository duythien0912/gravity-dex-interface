
import { combineReducers } from '@reduxjs/toolkit';
import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import { all } from 'redux-saga/effects';
import { LOCAL_STORE, localStoreReducer } from '../modules/store/slice'
import { LIQUIDITY, liquidityReducer } from '../modules/liquidityRest/slice';
import { handleQueryParams } from '../modules/liquidityRest/saga';

const rootReducer = combineReducers({
    [LIQUIDITY]: liquidityReducer,
    [LOCAL_STORE]: localStoreReducer
});

const sagaMiddleware = createSagaMiddleware();
function* rootSaga() {
    yield all([
        handleQueryParams(),
    ])
}
const createStore = () => {
    const store = configureStore({
        reducer: rootReducer,
        middleware: [sagaMiddleware]
    });
    sagaMiddleware.run(rootSaga);
    return store;
}

export default createStore;
