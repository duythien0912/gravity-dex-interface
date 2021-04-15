import { call, put, takeLatest } from 'redux-saga/effects';
import { queryAllBalances } from '../../api/bank-rest';
import { liquidityAction } from './slice';

export function* handleQueryParams() {
    const { queryParamsSuccess, queryParamsFail } = liquidityAction;
    try {
        const params = yield call(queryParams);
        yield put(queryParamsSuccess(params));
    } catch (err) {
        yield put(queryParamsFail(err));
    }
}

export function* watchParams() {
    const { requestQueryParams } = liquidityAction;
    yield takeLatest(requestQueryParams, handleQueryParams);
}

