import {

    createSlice
} from "@reduxjs/toolkit";
import { combineReducers } from '@reduxjs/toolkit';
import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import { all } from 'redux-saga/effects';
import { REST, restReducer } from '../modules/liquidityRest/slice';
import { handleQueryParams } from '../modules/liquidityRest/saga';
// combineReducers,
// configureStore,
// import createSagaMiddleware from 'redux-saga';

//TEST DATA
const TEST_INIT_DATA = {
    userData: {
        balance: {
            atom: 100,
            iris: 200,
            kava: 300,
            luna: 400,
            band: 500,
        },
        slippage: 1,
        walletStatus: 'normal' // normal, pending, error
    },
    priceData: {
        atom: 1,
        iris: 2,
        kava: 3,
        luna: 4,
        band: 5
    },
    //헬퍼 함수 하나 빼서 getPool(a, b) pair 하나씩 넣고 안에서 알파벳 순으로 솔팅 돌리고 하면 될듯
    poolsData: {
        pairs: ['atom', 'iris', 'band', 'luna', 'kava'],
        pools: {
            "atom/iris": { atom: 1000.123123123123, iris: 1003, totalPoolToken: 1, userPoolData: { poolTokenAmount: 0.011234 } },
            "atom/band": { atom: 871.123, band: 111.31221, totalPoolToken: 1, userPoolData: {} },
            "band/luna": { band: 233333, luna: 12234.23124, totalPoolToken: 1, userPoolData: { poolTokenAmount: 0.01232 } },
            "atom/luna": { atom: 423333, luna: 12234.23124, totalPoolToken: 1, userPoolData: {} },
            "kava/luna": { kava: 13333.1231215, luna: 12234.23124, totalPoolToken: 1, userPoolData: {} },
        }
    }
}

export const RootReducer = createSlice({
    name: "rootStore",
    initialState: TEST_INIT_DATA,
    reducers: {
        togglePendingStatus: (state, action) => {
            let currentStatus = state.userData.walletStatus
            state.userData.walletStatus = currentStatus === 'pending' ? 'normal' : 'pending'
        },
        setSlippage: (state, action) => {
            state.userData.slippage = action.payload
        }
    },
});

// const reducer = combineReducers({ store: RootReducer.reducer });
// const sagaMiddleware = createSagaMiddleware();
// export default configureStore({
//     reducer, middleware: [sagaMiddleware],
// });

export const rootReducer = combineReducers({
    [REST]: restReducer,
    store: RootReducer.reducer
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
        devTools: true,
        middleware: [sagaMiddleware]
    });
    sagaMiddleware.run(rootSaga);
    return store;
}
export default createStore;
