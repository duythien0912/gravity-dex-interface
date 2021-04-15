import { createSelector, createSlice } from '@reduxjs/toolkit';
const name = 'cosmos';

const initialState = {
    userAddress: null,
    userBalances: {}
};

const reducers = {
    requestQueryAllBalances: (state, { payload: userAddress }) => {
        state.userAddress = userAddress
    },
    queryAllBalancesSuccess: (state, { payload: balances }) => {
        state.userBalances = balances
    }
}

const slice = createSlice({
    name, initialState, reducers
});

const selectAllState = createSelector(
    state => state.userAddress,
    state => state.userBalances,
    (userAddress, userBalances) => {
        return { userAddress, userBalances };
    }
);

export const cosmosSelector = {
    all: state => selectAllState(state[COSMOS])
};

export const COSMOS = slice.name;
export const cosmosReducer = slice.reducer;
export const cosmosAction = slice.actions;