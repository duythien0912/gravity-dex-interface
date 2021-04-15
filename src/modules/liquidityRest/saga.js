import { call, put, takeLatest } from 'redux-saga/effects';
import { queryParams } from '../../api/liquidity-rest';
import { restAction } from './slice';

export function* handleQueryParams() {
    const { queryParamsSuccess, queryParamsFail } = restAction;
    try {
        const params = yield call(queryParams);
        yield put(queryParamsSuccess(params));
    } catch (err) {
        yield put(queryParamsFail(err));
    }
}

export function* watchParams() {
    const { queryParams } = restAction;
    yield takeLatest(queryParams, handleQueryParams);
}

