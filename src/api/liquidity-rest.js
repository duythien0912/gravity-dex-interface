import { Api } from '@starport/tendermint-liquidity-js/tendermint/liquidity/tendermint.liquidity.v1beta1/module/rest.js'
import { queryAllBalances } from './bank-rest'
const BASE_URL = "https://api.gravity.bharvest.io"
const liquidityRestApi = new Api({ baseUrl: BASE_URL })

export const queryParams = async () => {
    try {
        const response = await liquidityRestApi.queryParams()
        return response.data.params
    } catch (e) {
        console.log(e)
    }
}

export const queryLiquidityPools = async () => {
    try {
        const response = await liquidityRestApi.queryLiquidityPools()
        console.log('response', response)
        const addressBalance = await queryAllBalances('cosmos10d2sku6rjarnhn2va9pf2uv8p6mrwth3g8z7mr')
        const test = await queryLiquidityPool('1')
        console.log('test', test)
        console.log('addressBalance', addressBalance)
        return response.data
    } catch (e) {
        console.log(e)
        return null
    }
}

export const queryLiquidityPool = async (poolId) => {
    try {
        const response = await liquidityRestApi.queryLiquidityPool(poolId)
        console.log('res', response)
        return response.data
    } catch (e) {
        console.log(e)
        return null
    }
}