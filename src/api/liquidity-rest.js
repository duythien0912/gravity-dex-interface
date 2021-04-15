import { Api } from '@starport/tendermint-liquidity-js/tendermint/liquidity/tendermint.liquidity.v1beta1/module/rest.js'

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
        return response.data
    } catch (e) {
        console.log(e)
    }
}