import { createSelector, createSlice } from '@reduxjs/toolkit';
const name = 'REST';

const initialState = {
    params: null,
    pools: null,
    isParams: false,
    isPools: false,
    isLoading: false,
};

const reducers = {
    queryParams: (state) => {
        state.isParams = false;
    },
    queryParamsSuccess: (state, { payload: params }) => {
        state.isParams = true;
        console.log("success")
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

export const restSelector = {
    all: state => selectAllState(state[REST])
};

export const REST = slice.name;
export const restReducer = slice.reducer;
export const restAction = slice.actions;