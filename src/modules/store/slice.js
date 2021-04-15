import { createSlice, createSelector } from "@reduxjs/toolkit";
const name = "store";

const initialState = {
    //TEST DATA
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

const reducers = {
    togglePendingStatus: (state, action) => {
        let currentStatus = state.userData.walletStatus
        state.userData.walletStatus = currentStatus === 'pending' ? 'normal' : 'pending'
    },
    setSlippage: (state, action) => {
        state.userData.slippage = action.payload
    }
}

const slice = createSlice({
    name, initialState, reducers
});

const selectAllState = createSelector(
    state => state.userData,
    state => state.priceData,
    state => state.poolsData,
    (userData, priceData, poolsData) => {
        return { userData, priceData, poolsData };
    }
);

export const localStoreSelector = {
    all: state => selectAllState(state[LOCAL_STORE])
};

export const LOCAL_STORE = slice.name;
export const localStoreReducer = slice.reducer;
export const localStoreAction = slice.actions;