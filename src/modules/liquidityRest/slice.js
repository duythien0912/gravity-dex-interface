import { createSelector, createSlice } from '@reduxjs/toolkit';
const name = 'liquidity';

const initialState = {
    params: null,
    pools: null,
    isParams: false,
    isPools: false,
    isLoading: false,
};

const reducers = {
    requestQueryParams: (state) => {
        state.isParams = false;
    },
    queryParamsSuccess: (state, { payload: params }) => {
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
export const liquidityReducer = slice.reducer;
export const liquidityAction = slice.actions;