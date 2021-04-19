import { txClient } from "@starport/tendermint-liquidity-js/tendermint/liquidity/tendermint.liquidity.v1beta1/module"

export async function BroadcastLiquidityTx(signer, txInfo) {
    const txGenerator = await txClient(signer, { addr: "https://rpc.gravity.bharvest.io" })
    console.log(txInfo)
    const test = await txGenerator.msgCreatePool(txInfo.data)

    console.log(test)
    const test2 = await txGenerator.signAndBroadcast([test])
    console.log(test2)
}