import * as React from 'react'
import styled from "styled-components"
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from 'react-router-dom'

//UI components
import ChangeArrow from "../../assets/svgs/ChangeArrow"
import BaseCard from "../../components/Cards/BaseCard"
import TokenInputController from "../../components/TokenInputController/index"
import ActionButton from "../../components/Buttons/ActionButton"

//functions
import { cosmosSelector } from "../../modules/cosmosRest/slice"
import { liquiditySelector } from "../../modules/liquidityRest/slice"
import { BroadcastLiquidityTx } from "../../cosmos-amm/tx-client.js"
import { getSelectedPairsPoolData, getPoolPrice, cutNumber, calculateSlippage, sortCoins, getMinimalDenomCoin } from "../../utils/global-functions"

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
    } else if (status === 'create' || status === 'noPoolToken') {
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
    const reduxDispatch = useDispatch()
    const history = useHistory();

    const { userSlippage } = useSelector((state) => state.store.userData)
    const { userBalances, userAddress } = useSelector(cosmosSelector.all);
    const { poolsInfo, params } = useSelector(liquiditySelector.all)

    const [selectedPoolData, setSelectedPoolData] = React.useState(null)
    const poolData = poolsInfo?.poolsData

    const [slippage, setSlippage] = React.useState(0)
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
        if (state.fromCoin !== '' && state.toCoin) {
            //get and set pool pair status
            const sortedCoinsData = sortCoins(state.fromCoin, state.toCoin)
            const sortedCoins = sortedCoinsData.coins
            const isReverse = sortedCoinsData.isReverse

            //get slected pairs pool data
            const selectedPairsPoolData = poolData[`${sortedCoins[0]}/${sortedCoins[1]}`]

            //when pool exists
            if (selectedPairsPoolData !== undefined) {
                const price = selectedPairsPoolData.reserve_coin_balances[getMinimalDenomCoin(state.toCoin)] / selectedPairsPoolData.reserve_coin_balances[getMinimalDenomCoin(state.fromCoin)]

                setSelectedPoolData(selectedPairsPoolData)
                setSlippage(calculateSlippage(state.toAmount * 1000000, selectedPairsPoolData.reserve_coin_balances[getMinimalDenomCoin(state.toCoin)]) * 100)
                dispatch({ type: TYPES.UPDATE_PRICE, payload: { price: cutNumber(price, 6), isReverse: isReverse } })
            } else {
                // console.log('no pool/creat a new pool')
            }

        } else {
            // console.log('need both coins')
        }

    }, [poolsInfo, poolData, state.fromCoin, state.toCoin, state.toAmount])

    //reducer for useReducer
    function reducer(state, action) {
        const { targetPair, counterTargetPair } = getPairs(action)

        const selectedPairAmount = action.payload?.amount || ''
        const counterPairAmount = state[`${counterTargetPair}Amount`]

        const selectedPairMyBalance = userBalances[state[`${targetPair}Coin`]]
        const counterPairMyBalance = userBalances[state[`${counterTargetPair}Coin`]]

        const userFromCoinBalance = userBalances[getMinimalDenomCoin(state.fromCoin)] / 1000000
        const userToCoinBalance = userBalances[getMinimalDenomCoin(state.toCoin)] / 1000000

        const price = targetPair === 'from' ? state.price : 1 / state.price

        let isOver = false
        let isEmpty = false

        switch (action.type) {
            case TYPES.UPDATE_PRICE:

                return { ...state, price: action.payload.price, isReverse: action.payload.isReverse }

            case TYPES.AMOUNT_CHANGE:

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

                console.log('slippage', calculateSlippage((selectedPairAmount * 1000000), selectedPoolData.reserve_coin_balances[getMinimalDenomCoin(state[`${targetPair}Coin`])]))
                console.log(state[`${targetPair}Coin`], state[`${targetPair}Amount`])
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
                    } else if (selectedPooldata.pool_coin_amount === '0') {
                        return { ...state, [`${targetPair}Coin`]: action.payload.coin, price: getPoolPrice(state, action, counterTargetPair, poolData), fromAmount: '', toAmount: '', status: 'noPoolToken' }
                    } else {
                        return { ...state, [`${targetPair}Coin`]: action.payload.coin, price: getPoolPrice(state, action, counterTargetPair, poolData), fromAmount: '', toAmount: '', status: 'empty' }
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
            return state.status === 'create' || state.status === 'noPoolToken' ? 'create' : (isOver ? 'over' : isEmpty ? 'empty' : 'normal')
        }
    }



    function swap() {
        // console.log(state.isReverse ? (1 / state.price).toFixed(6) : state.price)
        // console.log(slippageRange)
        // console.log(String(Number((Number(state.isReverse ? 1 / state.price : state.price) * 1.1).toFixed(18).replace('.', ''))))
        // console.log(state.isReverse)
        // console.log('price', state.price)
        const slippageRange = 1 + userSlippage / 100

        BroadcastLiquidityTx({
            type: 'msgSwap',
            data: {
                swapRequesterAddress: userAddress,
                poolId: Number(selectedPoolData.id),
                swapTypeId: 1,
                offerCoin: { denom: getMinimalDenomCoin(state.fromCoin), amount: String(Math.floor(state.fromAmount * 1000000)) },
                demandCoinDenom: getMinimalDenomCoin(state.toCoin),
                offerCoinFee: { denom: getMinimalDenomCoin(state.fromCoin), amount: String(Math.floor(state.fromAmount * 1000000 * 0.001500000000000000)) },
                orderPrice: String((state.price * (state.isReverse ? 2 - slippageRange : slippageRange)).toFixed(18).replace('.', '').replace(/(^0+)/, ""))
            }
        }, reduxDispatch, { type: 'Swap', userAddress: userAddress }
        )

        // reduxDispatch({ type: 'store/setTxModalStatus', payload: {} })

        // reduxDispatch({ type: 'store/togglePendingStatus' })
        // setTimeout(() => {
        //     reduxDispatch({ type: 'store/togglePendingStatus' })
        // }, 3000)
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
                        <div className="right">{(state.price !== '-' && !isNaN(state.price)) ? `${cutNumber(state.price, 6)} ${state.fromCoin.toUpperCase()} per ${state.toCoin.toUpperCase()}` : '-'}</div>
                    </div>

                    <div className="swap-detail">
                        <div className="left">Swap Fee</div>
                        <div className="right">{params ? params?.swap_fee_rate * 100 : ''}%</div>
                    </div>

                    <div className="swap-detail">
                        <div className="left">Slippage Tolerance</div>
                        <div className="right">{userSlippage}%</div>
                    </div>

                    {/* Swap Button */}
                    <ActionButton onClick={() => {
                        if (state.status === 'create') {
                            create(state.fromCoin, state.toCoin)
                        } else if (state.status === 'noPoolToken') {
                            history.push(`/Create?from=${state.fromCoin}&to=${state.toCoin}&emptyPool=true`)
                        } else {
                            swap()
                        }
                    }} status={getButtonCssClassNameByStatus(state.status, state.fromCoin, state.toCoin)} css={{ marginTop: "16px" }}>
                        {getButtonNameByStatus(state.status, state.fromCoin, state.toCoin)}
                    </ActionButton>

                    <div style={{ transform: `translateY(${isBoard && state.status !== "noPoolToken" ? '0' : '-200'}px)` }} className="result-detail-board">
                        <div className="content">
                            <div className="detail">
                                <div className="title">Estimated Receives</div>
                                <div className="data">{state.toAmount ? cutNumber(cutNumber(state.toAmount, 4) * Number(cutNumber(1 - (slippage / 100), 4)), 4) : '?'} {state.toCoin.toUpperCase()}</div>
                            </div>
                            <div className="detail">
                                <div className="title">Price Impact</div>
                                <div className="data">{slippage ? cutNumber(slippage, 4) : '?'}%</div>
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