import { txClient } from "@starport/tendermint-liquidity-js/tendermint/liquidity/tendermint.liquidity.v1beta1/module"

export async function BroadcastLiquidityTx(signer, data) {
    const txGenerator = await txClient(signer, { addr: "https://rpc.gravity.bharvest.io" })
    console.log('test')
    console.log(txGenerator)
}