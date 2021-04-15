import { call, put, takeLatest } from 'redux-saga/effects';
import { queryParams } from '../../api/liquidity-rest';
import { liquidityAction } from './slice';

function* handleQueryParams() {
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

