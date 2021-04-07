import * as React from 'react'
import styled from "styled-components"
import { useDispatch, useSelector } from "react-redux";
import { getSelectedPairsPoolData, getPoolPrice, cutNumber, getMyCoinBalance } from "../../utils/global-functions"
import { useHistory } from 'react-router-dom'

import ChangeArrow from "../../assets/svgs/ChangeArrow"

import BaseCard from "../../components/Cards/BaseCard"
import TokenInputController from "../../components/TokenInputController/index"
import ActionButton from "../../components/Buttons/ActionButton"


//Styled-components
const SwapWrapper = styled.div`
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
        transition: opacity 0.2s;

        .arrow {
            cursor: pointer;

            svg {
                stroke: #4397ff;
            }

            &:hover {
                opacity: 0.6;
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
    CHANGE_FROM_TO_COIN: 'CHANGE_FROM_TO_COIN'
}

// component function
function SwapCard() {

    React.useEffect(() => {
        //미로그인시 connectWallet 스테이터스 아니면 empty로

    }, [])

    const { balance: myBalance, slippage } = useSelector((state) => state.store.userData)
    const poolData = useSelector((state) => state.store.poolsData.pools)
    const storeDispatch = useDispatch()
    const history = useHistory();

    //reducer for useReducer
    function reducer(state, action) {
        const { targetPair, counterTargetPair } = getPairs(action)
        const selectedPairAmount = action.payload?.amount || ''
        //state[`${targetPair}Amount`]
        const counterPairAmount = state[`${counterTargetPair}Amount`]
        const selectedPairMyBalance = myBalance[state[`${targetPair}Coin`]]
        const counterPairMyBalance = myBalance[state[`${counterTargetPair}Coin`]]
        const price = targetPair === 'from' ? state.price : 1 / state.price

        let isOver = false
        let isEmpty = false
        let isCounterPairEmpty = false

        switch (action.type) {

            case TYPES.AMOUNT_CHANGE:
                setAmountCheckVariables()

                console.log('targetPair', targetPair)
                console.log('selectedPairAmount', selectedPairAmount)
                if (targetPair === 'from') {
                    if (selectedPairAmount > myBalance[state.fromCoin]) {
                        isOver = true
                    } else {
                        isOver = false
                    }
                } else {
                    if ((selectedPairAmount * price) > myBalance[state.fromCoin]) {
                        isOver = true
                    } else {
                        isOver = false
                    }
                }
                return { ...state, [`${targetPair}Amount`]: selectedPairAmount, [`${counterTargetPair}Amount`]: (selectedPairAmount * price), status: getStatus(state) }

            case TYPES.SET_MAX_AMOUNT:
                setAmountCheckVariables()
                return { ...state, [`${targetPair}Amount`]: selectedPairAmount, [`${counterTargetPair}Amount`]: (selectedPairAmount * price), status: getStatus(state) }

            case TYPES.SELECT_COIN:
                const coinA = state[`${counterTargetPair}Coin`]
                const coinB = action.payload.coin
                const isBothCoin = coinA !== '' && coinB !== ''

                if (!isBothCoin) {
                    return { ...state, [`${targetPair}Coin`]: action.payload.coin }
                } else {
                    const selectedPooldata = getSelectedPairsPoolData(state, action, counterTargetPair, poolData)
                    state.status = "normal"
                    setAmountCheckVariables()

                    if (!selectedPooldata) {
                        return { ...state, status: "create", [`${targetPair}Coin`]: action.payload.coin, price: '-' }
                    } else {
                        return { ...state, [`${targetPair}Coin`]: action.payload.coin, price: getPoolPrice(state, action, counterTargetPair, poolData), status: getStatus(state) }
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
                    let isOver = state.fromAmount > myBalance[state.fromCoin] || state.toAmount > myBalance[state.toCoin]
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
            if (selectedPairAmount == 0) {
                isEmpty = true
            } else {
                isEmpty = false
            }
            // if (counterPairAmount === '' || counterPairAmount == 0) {
            //     isCounterPairEmpty = true
            // }
        }

        function getStatus(state) {
            return state.status === 'create' ? 'create' : (isOver ? 'over' : (isEmpty || isCounterPairEmpty) ? 'empty' : 'normal')
        }
    }

    const [state, dispatch] = React.useReducer(reducer, {
        fromCoin: 'atom',
        toCoin: '',
        fromAmount: '',
        toAmount: '',
        status: 'empty', // connectWallet, notSelected, empty, over, normal
        price: '-'
    })

    function swap() {
        alert('swap')
        storeDispatch({ type: 'rootStore/togglePendingStatus' })
        setTimeout(() => {
            storeDispatch({ type: 'rootStore/togglePendingStatus' })
        }, 3000)
    }

    function create(from, to) {
        history.push(`/create?from=${from}&to=${to}`)
    }

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
                        header={{ title: 'From', balance: getMyCoinBalance(state.fromCoin, myBalance) }}
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
                        header={{ title: 'To (estimated)', balance: getMyCoinBalance(state.toCoin, myBalance) }}
                        coin={state.toCoin}
                        amount={state.toAmount}
                        counterPair={state.fromCoin}
                        dispatch={dispatch}
                        dispatchTypes={{ amount: TYPES.AMOUNT_CHANGE, coin: TYPES.SELECT_COIN, max: TYPES.SET_MAX_AMOUNT }}
                    />

                    {/* Swap detail */}
                    <div className="swap-detail">
                        <div className="left">Price</div>
                        <div className="right">{state.price !== '-' ? (`${parseFloat(cutNumber(state.price, 6))} ${state.fromCoin.toUpperCase()} per ${state.toCoin.toUpperCase()}`) : '-'}</div>
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
                </SwapWrapper>
            </BaseCard>

        </>
    )
}

export default SwapCard