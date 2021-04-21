import { txClient } from "@starport/tendermint-liquidity-js/tendermint/liquidity/tendermint.liquidity.v1beta1/module"
import { chainInfo } from "./config"
export async function BroadcastLiquidityTx(txInfo) {
    const signer = window.getOfflineSigner(chainInfo.chainId);
    const txGenerator = await txClient(signer, { addr: "https://rpc.gravity.bharvest.io" })
    let msg = null
    if (txInfo.type === 'msgCreatePool') {
        try {
            msg = txGenerator.msgCreatePool(txInfo.data)
        } catch (e) {
            console.log(e)
        }
    }
    console.log(msg)
    try {
        const txBroadcastResponse = await txGenerator.signAndBroadcast([msg])
        console.log(txBroadcastResponse)
        if (txBroadcastResponse.code !== undefined) {
            console.log("error")
            console.log(txBroadcastResponse.rawLog?.split(':')[2].trim())
        } else {
            console.log("success")
            console.log(txBroadcastResponse)
        }

    } catch (e) {
        console.log("error", e)
        console.log(e.rawLog?.split(':')[2].trim())
    }
}