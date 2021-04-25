import * as React from 'react'
import styled from "styled-components"
import { useDispatch, useSelector } from "react-redux";
import { getSelectedPairsPoolData, getPoolPrice, cutNumber, calculateSlippage } from "../../utils/global-functions"
import { useHistory } from 'react-router-dom'

import ChangeArrow from "../../assets/svgs/ChangeArrow"

import BaseCard from "../../components/Cards/BaseCard"
import TokenInputController from "../../components/TokenInputController/index"
import ActionButton from "../../components/Buttons/ActionButton"
import { cosmosSelector } from "../../modules/cosmosRest/slice"
import { liquiditySelector } from "../../modules/liquidityRest/slice"
import { BroadcastLiquidityTx } from "../../cosmos-amm/tx-client.js"
//Styled-components
const SwapWrapper = styled.div`
    position: relative;

    .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 16px;

        .title {
            padding-left: 4px;
            font-weight: 500;
        }
    }

   .divider {
        display:flex;
        align-items:center;
        justify-content:center;
        padding: 16px 0;
        transition: transform 0.2s;

        .arrow {
            cursor: pointer;

            &:hover {
                transform: scale(1.2);
            }
        }
   }

   .swap-detail {
        display: flex;
        justify-content: space-between;
        align-items: center;

        padding: 6px 12px;

        font-size: 14px;
        font-weight: 500;
        color: rgb(86, 90, 105);

        .left {
            
        }

        .right {

        }
   }

   .result-detail-board {
        position: absolute;
        width: 100%;
        max-width: 380px;
        height: 130px;
        padding-bottom: 20px;
        
        
        z-index: -1;

        transition:transform 0.4s ease-out;
        transform: translateY(-130px);
        background-color: transparent;
       
       .content {
            padding: 30px 20px 20px;
            background-color:#1b142161;
            height: 110px;
            border-radius: 12px;

            color: #fff;
            font-weight: 500;

        .detail {
            display: flex;
            justify-content: space-between;
            line-height: 2;

            .data {
                /* font-weight: bold;
                font-size: 18px; */
            }

            &:first-child {
                .data {
                    font-weight: bold;
                }
            }
        }
       }
   }
`

//for display
function getButtonNameByStatus(status, fromCoin, toCoin) {
    if (fromCoin === '' || toCoin === '') {
        return 'Select a coin'
    } else if (status === 'over') {
        return 'Insufficient balance'
    } else if (status === 'empty') {
        return 'Enter an amount'
    } else if (status === 'create') {
        return 'Create a new pool'
    } else {
        return 'SWAP'
    }
}

function getButtonCssClassNameByStatus(status, fromCoin, toCoin) {
    if (fromCoin === '' || toCoin === '' || status === 'over' || status === 'empty') {
        return 'disabled'
    } else {
        return 'normal'
    }
}

//reducer action types
const TYPES = {
    AMOUNT_CHANGE: 'AMOUNT_CHANGE',
    SELECT_COIN: 'SELECT_COIN',
    SET_MAX_AMOUNT: 'SET_MAX_AMOUNT',
    CHANGE_FROM_TO_COIN: 'CHANGE_FROM_TO_COIN',
    UPDATE_PRICE: 'UPDATE_PRICE'
}

// component function
function SwapCard() {
    const { slippage } = useSelector((state) => state.store.userData)
    const storeDispatch = useDispatch()
    const history = useHistory();
    const { userBalances, userAddress } = useSelector(cosmosSelector.all);
    const { poolsInfo } = useSelector(liquiditySelector.all)
    const poolData = poolsInfo?.poolsData
    const [slipage, setSlippage] = React.useState(0)
    const [selectedPoolData, setSelectedPoolData] = React.useState(null)
    const [state, dispatch] = React.useReducer(reducer, {
        fromCoin: 'atom',
        toCoin: '',
        fromAmount: '',
        toAmount: '',
        status: 'empty', // connectWallet, notSelected, empty, over, normal
        price: '-',
        isBoard: false,
        isReverse: false,
    })

    React.useEffect(() => {
        //미로그인시 connectWallet 스테이터스 아니면 empty로
        console.log('poolsInfo', poolsInfo)
        console.log('state', state)
        if (state.fromCoin !== '' && state.toCoin) {
            const sortedCoins = [state.fromCoin, state.toCoin].sort()

            let isReverse = true
            console.log(sortedCoins[0], state.fromCoin)
            if (sortedCoins[0] === state.fromCoin) {
                isReverse = false
            }

            const selectedPairsPoolData = poolData[`${sortedCoins[0]}/${sortedCoins[1]}`]
            if (selectedPairsPoolData !== undefined) {
                const price = selectedPairsPoolData.reserve_coin_balances['u' + state.toCoin] / selectedPairsPoolData.reserve_coin_balances['u' + state.fromCoin]
                console.log('selectedPairsPoolData', selectedPairsPoolData === undefined ? false : selectedPairsPoolData)
                console.log('price', price)
                setSelectedPoolData(selectedPairsPoolData)
                setSlippage(calculateSlippage(state.toAmount * 1000000, selectedPairsPoolData.reserve_coin_balances['u' + state.toCoin]) * 100)
                dispatch({ type: TYPES.UPDATE_PRICE, payload: { price: cutNumber(price, 6), isReverse: isReverse } })
            } else {
                console.log('no Pool')
            }

        } else {
            console.log('need both coins')
        }

    }, [poolsInfo, state.fromCoin, state.toCoin, state.toAmount])

    //reducer for useReducer
    function reducer(state, action) {
        const { targetPair, counterTargetPair } = getPairs(action)

        const selectedPairAmount = action.payload?.amount || ''
        const counterPairAmount = state[`${counterTargetPair}Amount`]

        const selectedPairMyBalance = userBalances[state[`${targetPair}Coin`]]
        const counterPairMyBalance = userBalances[state[`${counterTargetPair}Coin`]]

        const userFromCoinBalance = userBalances['u' + state.fromCoin] / 1000000
        const userToCoinBalance = userBalances['u' + state.toCoin] / 1000000

        const price = targetPair === 'from' ? state.price : 1 / state.price

        let isOver = false
        let isEmpty = false

        switch (action.type) {
            case TYPES.UPDATE_PRICE:
                return { ...state, price: action.payload.price, isReverse: action.payload.isReverse }

            case TYPES.AMOUNT_CHANGE:
                setAmountCheckVariables()

                if (targetPair === 'from') {
                    if (selectedPairAmount > userFromCoinBalance) {
                        isOver = true
                    } else {
                        isOver = false
                    }
                } else {
                    if (selectedPairAmount > userToCoinBalance) {
                        isOver = true
                    } else {
                        isOver = false
                    }
                }

                if (selectedPairAmount === '' || selectedPairAmount === '0') {
                    isEmpty = true
                } else {
                    isEmpty = false
                }

                if (price !== '-' && !isNaN(price)) {
                    return { ...state, [`${targetPair}Amount`]: selectedPairAmount, [`${counterTargetPair}Amount`]: (cutNumber(selectedPairAmount * price, 6)), status: getStatus(state) }
                } else {
                    return { ...state, [`${targetPair}Amount`]: selectedPairAmount, [`${counterTargetPair}Amount`]: '', status: getStatus(state) }
                }

            case TYPES.SET_MAX_AMOUNT:
                setAmountCheckVariables()
                return { ...state, [`${targetPair}Amount`]: selectedPairAmount, [`${counterTargetPair}Amount`]: (cutNumber(selectedPairAmount * price, 6)), status: getStatus(state) }

            case TYPES.SELECT_COIN:
                const coinA = state[`${counterTargetPair}Coin`]
                const coinB = action.payload.coin
                const isBothCoin = coinA !== '' && coinB !== ''

                if (!isBothCoin) {
                    return { ...state, [`${targetPair}Coin`]: action.payload.coin, fromAmount: '', toAmount: '' }
                } else {
                    const selectedPooldata = getSelectedPairsPoolData(state, action, counterTargetPair, poolData)
                    state.status = "normal"
                    setAmountCheckVariables()

                    if (!selectedPooldata) {
                        return { ...state, status: "create", [`${targetPair}Coin`]: action.payload.coin, fromAmount: '', toAmount: '', price: '-' }
                    } else {
                        return { ...state, [`${targetPair}Coin`]: action.payload.coin, price: getPoolPrice(state, action, counterTargetPair, poolData), fromAmount: '', toAmount: '', status: getStatus(state) }
                    }
                }

            case TYPES.CHANGE_FROM_TO_COIN:

                const fromToChangeObject = { ...state, fromCoin: state.toCoin, toCoin: state.fromCoin, fromAmount: state.toAmount, toAmount: state.fromAmount }

                if (state.status === 'create') {
                    return { ...fromToChangeObject, price: '-' }
                }

                if (state.toCoin === '' || state.fromCoin === '') {
                    return fromToChangeObject
                } else {
                    let isOver = state.fromAmount > userFromCoinBalance || state.toAmount > userToCoinBalance
                    const sortedCoins = [state.toCoin, state.fromCoin].sort()
                    const selectedPairsPoolData = poolData[`${sortedCoins[0]}/${sortedCoins[1]}`]
                    const price = selectedPairsPoolData[state.toCoin] / selectedPairsPoolData[state.fromCoin]
                    return { ...fromToChangeObject, price, status: isOver ? 'over' : state.status }
                }

            default:
                console.log("DEFAULT: SWAP REDUCER")
                return state;
        }

        //helpers
        function getPairs(action) {
            let targetPair = null
            let counterTargetPair = null

            if (action.payload?.target) {
                targetPair = action.payload.target === "From" ? "from" : "to"
                counterTargetPair = targetPair === 'from' ? 'to' : 'from'
            } else {
                targetPair = 'from'
                counterTargetPair = 'to'
            }
            return { targetPair, counterTargetPair }
        }

        function setAmountCheckVariables() {
            if (selectedPairAmount > selectedPairMyBalance || counterPairAmount > counterPairMyBalance) {
                isOver = true
            } else {
                isOver = false
            }
            if (selectedPairAmount === 0) {
                isEmpty = true
            } else {
                isEmpty = false
            }
        }

        function getStatus(state) {
            return state.status === 'create' ? 'create' : (isOver ? 'over' : isEmpty ? 'empty' : 'normal')
        }
    }



    function swap() {
        console.log(state.isReverse)
        console.log(String(Number((Number(state.isReverse ? 1 / state.price : state.price) * 1.1).toFixed(18).replace('.', ''))))
        BroadcastLiquidityTx({
            type: 'msgSwap',
            data: {
                swapRequesterAddress: userAddress,
                poolId: Number(selectedPoolData.id),
                swapTypeId: 1,
                offerCoin: { denom: 'u' + state.fromCoin, amount: String(Math.floor(state.fromAmount * 1000000)) },
                demandCoinDenom: 'u' + state.toCoin,
                offerCoinFee: { denom: 'u' + state.fromCoin, amount: String(Math.ceil(state.fromAmount * 1000000 * 0.001500000000000000)) },
                orderPrice: String(Number((Number(state.isReverse ? 1 / state.price * 1 / 1.1 : state.price * 1.1)).toFixed(18).replace('.', '')))
            }

        }).then((res) => {
            console.log('swap res', res)
        }).catch((e) => {
            console.log('swap error', e)
        })

        storeDispatch({ type: 'store/togglePendingStatus' })
        setTimeout(() => {
            storeDispatch({ type: 'store/togglePendingStatus' })
        }, 3000)
    }

    function create(from, to) {
        history.push(`/create?from=${from}&to=${to}`)
    }
    const isBoard = state.fromCoin && state.toCoin && state.status !== "create"
    return (
        <>
            <BaseCard>
                <SwapWrapper>
                    {/* Header */}
                    <div className="header">
                        <div className="title">
                            Swap
                    </div>
                        <div />
                    </div>

                    {/* From */}
                    <TokenInputController
                        header={{ title: 'From' }}
                        coin={state.fromCoin}
                        amount={state.fromAmount}
                        counterPair={state.toCoin}
                        dispatch={dispatch}
                        dispatchTypes={{ amount: TYPES.AMOUNT_CHANGE, coin: TYPES.SELECT_COIN, max: TYPES.SET_MAX_AMOUNT }}
                    />

                    {/* From <> To change arrow */}
                    <div className="divider">
                        <div className="arrow" onClick={() => {
                            dispatch({ type: TYPES.CHANGE_FROM_TO_COIN })
                        }}>
                            <ChangeArrow />
                        </div>
                    </div>

                    {/* To */}
                    <TokenInputController
                        header={{ title: 'To (estimated)' }}
                        coin={state.toCoin}
                        amount={state.toAmount}
                        counterPair={state.fromCoin}
                        dispatch={dispatch}
                        dispatchTypes={{ amount: TYPES.AMOUNT_CHANGE, coin: TYPES.SELECT_COIN, max: TYPES.SET_MAX_AMOUNT }}
                    />

                    {/* Swap detail */}
                    <div className="swap-detail">
                        <div className="left">Price</div>
                        <div className="right">{state.price !== '-' ? `${cutNumber(state.price, 6)} ${state.fromCoin.toUpperCase()} per ${state.toCoin.toUpperCase()}` : '-'}</div>
                    </div>

                    <div className="swap-detail">
                        <div className="left">Slippage Tolerance</div>
                        <div className="right">{slippage}%</div>
                    </div>


                    {/* Swap Button */}
                    <ActionButton onClick={() => {
                        if (state.status !== 'create') {
                            swap()
                        } else {
                            create(state.fromCoin, state.toCoin)
                        }
                    }} status={getButtonCssClassNameByStatus(state.status, state.fromCoin, state.toCoin)} css={{ marginTop: "16px" }}>
                        {getButtonNameByStatus(state.status, state.fromCoin, state.toCoin)}
                    </ActionButton>

                    <div style={{ transform: `translateY(${isBoard ? '0' : '-200'}px)` }} className="result-detail-board">
                        <div className="content">
                            <div className="detail">
                                <div className="title">Estimated Receives</div>
                                <div className="data">{state.toAmount ? cutNumber(state.toAmount, 4) : '?'} {state.toCoin.toUpperCase()}</div>
                            </div>
                            <div className="detail">
                                <div className="title">Price Impact</div>
                                <div className="data">{cutNumber(slipage, 4)}%</div>
                            </div>
                            <div className="detail">
                                <div className="title"></div>
                                <div className="data"></div>
                            </div>
                        </div>
                    </div>
                </SwapWrapper>
            </BaseCard>
        </>
    )
}

export default SwapCard