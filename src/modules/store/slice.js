import { createSlice, createSelector } from "@reduxjs/toolkit";
const name = "store";

const initialState = {
    //TEST DATA
    userData: {
        slippage: 3,
        walletStatus: 'normal' // normal, pending, error
    },

    priceData: {
        atom: 1,
        iris: 2,
        kava: 3,
        luna: 4,
        band: 5
    },

    isWallet: false
}

const reducers = {
    togglePendingStatus: (state, action) => {
        let currentStatus = state.userData.walletStatus
        state.userData.walletStatus = currentStatus === 'pending' ? 'normal' : 'pending'
    },
    setIsWallet: (state, action) => {
        state.isWallet = action.payload
    },
    setSlippage: (state, action) => {
        state.userData.slippage = action.payload.slippage
    }
}

const slice = createSlice({
    name, initialState, reducers
});

const selectAllState = createSelector(
    state => state.userData,
    state => state.priceData,
    state => state.poolsData,
    state => state.isWallet,
    (userData, priceData, poolsData, isWallet) => {
        return { userData, priceData, poolsData, isWallet };
    }
);

export const storeSelector = {
    all: state => selectAllState(state[STORE])
};

export const STORE = slice.name;
export const storeReducer = slice.reducer;
export const storeAction = slice.actions;
