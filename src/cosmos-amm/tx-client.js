import { txClient } from "@starport/tendermint-liquidity-js/tendermint/liquidity/tendermint.liquidity.v1beta1/module"
import axios from "axios";
import { chainInfo } from "./config"

export async function BroadcastLiquidityTx(txInfo, dispatch, data) {
    dispatch(getTxProcessingStatus('init', data))

    const signer = window.getOfflineSigner(chainInfo.chainId);
    const txGenerator = await txClient(signer, { addr: chainInfo.rpc })
    let msg = null
    if (txInfo.type === 'msgCreatePool') {
        try {
            msg = txGenerator.msgCreatePool(txInfo.data)
        } catch (e) {
            console.log(e)
        }
    } else if (txInfo.type === 'msgDeposit') {
        try {
            msg = txGenerator.msgDepositWithinBatch(txInfo.data)
        } catch (e) {
            console.log(e)
        }
    } else if (txInfo.type === 'msgWithdraw') {
        try {
            msg = txGenerator.msgWithdrawWithinBatch(txInfo.data)
        } catch (e) {
            console.log(e)
        }
    } else if (txInfo.type === 'msgSwap') {
        try {
            msg = txGenerator.msgSwapWithinBatch(txInfo.data)
        } catch (e) {
            console.log(e)
        }
    }

    console.log(msg)
    try {
        const txBroadcastResponse = await txGenerator.signAndBroadcast([msg])
        console.log(txBroadcastResponse)
        if (txBroadcastResponse.code !== undefined) {
            const failMsg = { type: data.type, resultData: txBroadcastResponse.rawLog }
            console.log("error")
            dispatch(getTxProcessingStatus('broadcastFail', failMsg))
            console.log(txBroadcastResponse.rawLog)
            // alert(txBroadcastResponse.rawLog)
        } else {
            console.log("success")

            dispatch(getTxProcessingStatus('broadcastSuccess', data))
            // alert("success")
            console.log(txBroadcastResponse)
            getTxResult(txBroadcastResponse.height)

        }

    } catch (e) {
        console.log("error", e)
        console.log(e.rawLog?.split(':')[2].trim())
    }


    async function getTxResult(height) {
        const response = await axios.get(`${chainInfo.rpc}/block_results?height=${height}`)
        console.log(response.data.result.end_block_events)

        response.data.result.end_block_events.forEach((item) => {
            if (item.type === "swap_transacted") {
                item.attributes.forEach((result) => {
                    console.log(atob(result.key), atob(result.value))
                })
            }
        })

        response.data.result.txs_results[0].events.forEach((item) => {
            if (item.type === "swap_within_batch") {
                item.attributes.forEach((result) => {
                    console.log(atob(result.key), atob(result.value))
                })
            }
        })
        // atob()
    }

    function getTxProcessingStatus(status, data) {
        if (status === 'init') {
            return { type: 'store/setTxModalStatus', payload: { type: data.type, broadcastStatus: 'pending' } }
        }

        if (status === 'broadcastSuccess') {
            return { type: 'store/setTxModalStatus', payload: { type: data.type, broadcastStatus: 'success', transactionResultStatus: 'pending' } }
        }

        if (status === 'broadcastFail') {
            return { type: 'store/setTxModalStatus', payload: { type: data.type, broadcastStatus: 'fail', resultData: data.resultData } }
        }

        if (status === 'txSuccess') {
            return { type: 'store/setTxModalStatus', payload: { type: data.type, broadcastStatus: 'success', transactionResultStatus: 'success', resultData: "success" } }
        }
        if (status === 'txFail') {
            return { type: 'store/setTxModalStatus', payload: { type: data.type, broadcastStatus: 'success', transactionResultStatus: 'fail', resultData: "success" } }
        }
    }
}