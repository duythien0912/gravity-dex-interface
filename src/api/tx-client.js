import { txClient } from "@starport/tendermint-liquidity-js/tendermint/liquidity/tendermint.liquidity.v1beta1/module"

export async function BroadcastLiquidityTx(signer, txInfo) {
    const txGenerator = await txClient(signer, { addr: "https://rpc.gravity.bharvest.io" })
    let msg = null
    if (txInfo.type === 'msgCreatePool') {
        try {
            msg = txGenerator.msgCreatePool(txInfo.data)
        } catch (e) {
            console.log(e)
        }
    }

    try {
        console.log('here')
        const txBroadcastResponse = await txGenerator.signAndBroadcast([msg])
        console.log('here2')
        console.log(txBroadcastResponse)
        console.log(txBroadcastResponse.rawLog?.split(':')[2].trim())
    } catch (e) {
        console.log("error", e)
        console.log(e.rawLog?.split(':')[2].trim())
    }
}