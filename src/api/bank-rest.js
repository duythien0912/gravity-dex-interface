import { Api } from '@starport/tendermint-liquidity-js/cosmos/cosmos-sdk/cosmos.bank.v1beta1/module/rest.js'

const BASE_URL = "https://api.gravity.bharvest.io"
const bankRestApi = new Api({ baseUrl: BASE_URL })

export const queryAllBalances = async (address) => {
    try {
        const response = await bankRestApi.queryAllBalances(address)
        console.log(response.data)
        return response.data
    } catch (e) {
        console.log(e)
    }
}
