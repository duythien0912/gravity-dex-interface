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
        const txBroadcastResponse = await txGenerator.signAndBroadcast([msg], { fee: { amount: [], gas: "300000" } })
        console.log(txBroadcastResponse)
        if (txBroadcastResponse.code !== undefined) {
            const failMsg = { type: data.type, resultData: txBroadcastResponse.rawLog }
            dispatch(getTxProcessingStatus('broadcastFail', failMsg))

            console.log("error")
            console.log(txBroadcastResponse.rawLog)
        } else {
            console.log("success")
            console.log(txBroadcastResponse)

            dispatch(getTxProcessingStatus('broadcastSuccess', data))

            const txResult = setInterval(async () => {
                try {
                    const response = await getTxResult(txBroadcastResponse.height + 3, data)
                    const Msg = { type: data.type, resultData: response }
                    console.log('response', response)
                    if (response.resultData) {
                        dispatch(getTxProcessingStatus('txSuccess', Msg))
                    } else {
                        dispatch(getTxProcessingStatus('txFail', Msg))
                    }

                    clearInterval(txResult)
                } catch (e) {
                    console.log(e)
                }
            }, 3000)


        }

    } catch (e) {
        console.log("error", e)
        const failMsg = { type: data.type, resultData: String(e) }
        dispatch(getTxProcessingStatus('broadcastFail', failMsg))
        console.log(e.rawLog?.split(':')[2].trim())
    }


    async function getTxResult(height, data) {
        const response = await axios.get(`${chainInfo.rpc}/block_results?height=${height}`)
        console.log(response)
        const checks = getEndBlockChecks(data)
        let successData = false
        console.log(response.data.result.end_block_events)
        if (data.type === "Create") {
            successData = true
        } else {
            if (response.data.result?.end_block_events) {
                response.data.result?.end_block_events?.forEach((item) => {
                    if (item.type === checks.type) {
                        item.attributes.forEach((result) => {

                            if (atob(result.key) === checks.txAddress) {
                                console.log('isUserExecuted', checks.userAddress === atob(result.value))
                                successData[atob(result.key)] = atob(result.value)
                            }

                            console.log(atob(result.key), atob(result.value))
                        })
                    }
                })
            } else {
                successData = false
            }

        }

        // const test = await axios.get(`${chainInfo.rest}/tendermint/liquidity/v1beta1/pools/6/batch/swaps`)
        // console.log('poolId/bathch/swaps', test)
        // response.data.result.txs_results[0].events.forEach((item) => {
        //         item.attributes.forEach((result) => {
        //             console.log(atob(result.key), atob(result.value))
        //         })
        // })
        // atob()
        console.log(successData)
        return successData
    }

    function getTxProcessingStatus(status, data) {
        if (status === 'init') {
            return { type: 'store/setTxModalStatus', payload: { type: data.type, broadcastStatus: 'pending' } }
        }

        if (status === 'broadcastSuccess') {
            return { type: 'store/setTxModalStatus', payload: { type: data.type, broadcastStatus: 'success', transactionResultStatus: 'pending' } }
        }

        if (status === 'broadcastFail') {
            return { type: 'store/setTxModalStatus', payload: { type: data.type, broadcastStatus: 'fail', resultData: { data: data.resultData, isSuccess: false } } }
        }


        if (status === 'txSuccess') {
            return {
                type: 'store/setTxModalStatus', payload: { type: data.type, broadcastStatus: 'success', transactionResultStatus: 'success', resultData: { data: data.resultData, isSuccess: true } }
            }
        }
        if (status === 'txFail') {
            return { type: 'store/setTxModalStatus', payload: { type: data.type, broadcastStatus: 'success', transactionResultStatus: 'fail', resultData: "success" } }
        }
    }

    function getEndBlockChecks(data) {
        if (data.type === "Swap") {
            return { type: "swap_transacted", txAddress: 'swap_requester', userAddress: data.userAddress }
        }

        if (data.type === "Redeem") {
            return { type: "withdraw_from_pool", txAddress: 'withdrawer', userAddress: data.userAddress }
        }

        if (data.type === "Add Liquidity") {
            return { type: "deposit_to_pool", txAddress: 'depositor', userAddress: data.userAddress }
        }
    }
}