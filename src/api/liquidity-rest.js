import { Api } from '@starport/tendermint-liquidity-js/tendermint/liquidity/tendermint.liquidity.v1beta1/module/rest.js'
import { queryAllBalances, querySupplyOf } from './bank-rest'
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
        const response = await liquidityRestApi.queryLiquidityPools({ "pagination.limit": '100' })
        const promises = response.data.pools.map(queryPoolReserveTokens);
        const poolsData = await Promise.all(promises);
        let modifiedPoolsData = {}
        let poolTokenIndexer = {}

        response.data.pools.forEach((pool, index) => {

            modifiedPoolsData[`${pool.reserve_coin_denoms[0]}-${pool.reserve_coin_denoms[1]}`] = {
                id: pool.id,
                pool_coin_denom: pool.pool_coin_denom,
                pool_coin_amount: poolsData[index].pooltoken_amount.amount,
                reserve_coin_balances: {
                    [poolsData[index].balances[0].denom]: poolsData[index].balances[0].amount,
                    [poolsData[index].balances[1].denom]: poolsData[index].balances[1].amount
                }
            }
            poolTokenIndexer[pool.pool_coin_denom] = `${pool.reserve_coin_denoms[0]}-${pool.reserve_coin_denoms[1]}`
        })

        console.log(modifiedPoolsData)
        console.log(poolTokenIndexer)

        poolsData.forEach((pool) => {
            // console.log(pool)
            pool.balances.forEach((coin) => {
                // console.log(coin.denom, coin.amount)
            })

        })

        return response.data
    } catch (e) {
        console.log(e)
        return null
    }

    //helper
    async function queryPoolReserveTokens(pool) {
        const promises = await Promise.all([await queryAllBalances(pool.reserve_account_address), await querySupplyOf(pool.pool_coin_denom)])

        let response = promises[0]
        response.pooltoken_amount = promises[1].amount

        return response
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