import { createSelector, createSlice } from '@reduxjs/toolkit';
const name = 'cosmos';

const initialState = {
    userBalance: {}
};

const reducers = {
    requestqueryAllBalances: (state) => {

    },
    queryParamsSuccess: (state, { payload: balances }) => {
        state.isParams = true;
        state.params = params
    },
    queryParamsFail: (state) => {
        state.isParams = false;
    },
}

const slice = createSlice({
    name, initialState, reducers
});

const selectAllState = createSelector(
    state => state.params,
    state => state.pools,
    (params, pools) => {
        return { params, pools };
    }
);

export const liquiditySelector = {
    all: state => selectAllState(state[LIQUIDITY])
};

export const LIQUIDITY = slice.name;
export const liqudityReducer = slice.reducer;
export const liquidityAction = slice.actions;