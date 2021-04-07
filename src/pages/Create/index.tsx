import * as React from 'react'
import styled from "styled-components"
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from 'react-router-dom'
import { getSelectedPairsPoolData, getPoolPrice, cutNumber, getMyCoinBalance } from "../../utils/global-functions"
import ChangeArrow from "../../assets/svgs/ChangeArrow"

import BaseCard from "../../components/Cards/BaseCard"
import TokenInputController from "../../components/TokenInputController/index"
import ActionButton from "../../components/Buttons/ActionButton"

//Styled-components
const Wrapper = styled.div`
    position: absolute;
    top:0;
    left: 0;

    width: 100%;
    height: 100%;
    background-color:#fff;

    min-height: 100vh;
    background-position: 0px -30vh;
    background-repeat: no-repeat;
    background-image: radial-gradient(50% 50% at 50% 50%,rgb(3 34 255 / 20%) 0%,rgb(19 74 195 / 0) 100%);
`


const SwapWrapper = styled.div`
    .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 16px;

       .back {
           font-size: 24px;
           cursor: pointer;

           &:hover {
                opacity: 0.6;
            }
        }

       .title {
           font-size: 20px;
           font-weight: 500;
       }
    }

    .info-box {
        box-sizing: border-box;
        margin: 20px 0;
        min-width: 0px;
        padding: 1.25rem;
        background-color:rgb(234 243 253);
        color: rgb(0 124 255);
        border-radius: 12px;
        width: fit-content;
    }

   .divider {
        display:flex;
        align-items:center;
        justify-content:center;
        padding: 16px 0;
        transition: opacity 0.2s;

        .plus {
            font-size: 24px;
            font-weight: 300;
        }
   }

   .pool-creation-detail {
        border-radius: 20px;
        border: 1px solid rgb(247, 248, 250);

        margin-top: 16px;

        .title {
            padding: 16px;
            font-weight: 500;
            font-size: 14px;
        }

        .details {
            display: flex;
            justify-content: space-between;
            padding: 16px;
            border: 1px solid rgb(247, 248, 250);
            border-radius: 20px;

            .detail {
                text-align:center;
                flex: 1;
                .number {
                    font-weight: 500;
                }

                .text {
                    font-weight: 500;
                    font-size: 14px;
                    color: rgb(86, 90, 105);
                    padding-top: 4px;
                }
            }
        }
   }
`

//reducer action types
const TYPES = {
    AMOUNT_CHANGE: 'AMOUNT_CHANGE',
    SELECT_COIN: 'SELECT_COIN',
    SET_MAX_AMOUNT: 'SET_MAX_AMOUNT',
    SET_FROM_QUERY: 'SET_FROM_QUERY'
}

//helpers


function getButtonNameByStatus(status, fromCoin, toCoin) {
    if (fromCoin === '' || toCoin === '') {
        return 'Select a coin'
    } else if (status === 'over') {
        return 'Insufficient balance'
    } else if (status === 'empty') {
        return 'Enter an amount'
    } else {
        return 'CREATE'
    }
}

function getButtonCssClassNameByStatus(status, fromCoin, toCoin) {
    if (fromCoin === '' || toCoin === '' || status === 'over' || status === 'empty') {
        return 'disabled'
    } else {
        return 'normal'
    }
}


function SwapCard() {
    React.useEffect(() => {
        const searchParams = new URLSearchParams(history.location.search);

        if (searchParams.has('from')) {
            dispatch({ type: TYPES.SET_FROM_QUERY, payload: { from: searchParams.get('from'), to: searchParams.get('to') } })
        }

    }, [])

    const myBalance = useSelector((state) => state.store.userData.balance)
    const slippage = useSelector((state) => state.store.userData.slippage)
    const poolData = useSelector((state) => state.store.poolsData.pools)

    const history = useHistory();

    //reducer for useReducer
    function reducer(state, action) {
        const { targetPair, counterTargetPair } = getPairs(action)
        const selectedPairAmount = action.payload?.amount || ''
        //state[`${targetPair}Amount`]
        const counterPairAmount = state[`${counterTargetPair}Amount`]
        const selectedPairMyBalance = myBalance[state[`${targetPair}Coin`]]
        const counterPairMyBalance = myBalance[state[`${counterTargetPair}Coin`]]
        const price = targetPair === 'X' ? state.price : 1 / state.price

        let isOver = false
        let isEmpty = false
        let isCounterPairEmpty = false

        switch (action.type) {

            case TYPES.AMOUNT_CHANGE:

                setAmountCheckVariables()
                if (selectedPairAmount > selectedPairMyBalance) {
                    isOver = true
                } else {
                    isOver = false
                }

                return { ...state, [`${targetPair}Amount`]: selectedPairAmount, status: getStatus(state) }

            case TYPES.SET_MAX_AMOUNT:
                setAmountCheckVariables()
                return { ...state, [`${targetPair}Amount`]: selectedPairAmount, status: getStatus(state) }

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

            case TYPES.SET_FROM_QUERY:
                // toCoin 수량 계산 및 액션버튼 검증로직

                return { ...state, fromCoin: action.payload.from, toCoin: action.payload.to }
            default:
                console.log("DEFAULT: SWAP REDUCER")
                return state;
        }
        //helpers
        function getPairs(action) {
            let targetPair = null
            let counterTargetPair = null

            if (action.payload?.target) {
                targetPair = action.payload.target === "X" ? "from" : "to"
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
        status: 'empty' // connectWallet, notSelected, empty, over, normal
    })

    function swap() {
        alert('swap')
    }

    return (
        <Wrapper>
            <BaseCard>
                <SwapWrapper>
                    {/* Header */}
                    <div className="header">
                        <div className="back" onClick={() => { history.push('/pool') }}>←</div>
                        <div className="title"> Create a pool</div>
                        <div style={{ width: "23px" }}></div>
                    </div>

                    {/* Info */}
                    <div className="info-box">
                        <div style={{ fontWeight: "bold", marginBottom: "10px" }}>You are the first liquidity provider.</div>
                        <div style={{ marginBottom: "10px" }}>
                            The ratio of tokens you add will set the price of this pool.
                        </div>
                        Once you are happy with the rate click the supply button.
                    </div>

                    {/* From */}
                    <TokenInputController
                        header={{ title: 'X', balance: getMyCoinBalance(state.fromCoin, myBalance) }}
                        coin={state.fromCoin}
                        amount={state.fromAmount}
                        counterPair={state.toCoin}
                        dispatch={dispatch}
                        dispatchTypes={{ amount: TYPES.AMOUNT_CHANGE, coin: TYPES.SELECT_COIN, max: TYPES.SET_MAX_AMOUNT }}
                    />

                    {/* plus icon */}
                    <div className="divider">
                        <div className="plus">
                            +
                        </div>
                    </div>

                    {/* To */}
                    <TokenInputController
                        header={{ title: 'Y', balance: getMyCoinBalance(state.toCoin, myBalance) }}
                        coin={state.toCoin}
                        amount={state.toAmount}
                        counterPair={state.fromCoin}
                        dispatch={dispatch}
                        dispatchTypes={{ amount: TYPES.AMOUNT_CHANGE, coin: TYPES.SELECT_COIN, max: TYPES.SET_MAX_AMOUNT }}
                    />

                    {/* Swap detail */}
                    <div className="pool-creation-detail">
                        <div className="title">Initial prices and pool share</div>
                        <div className="details">
                            <div className="detail">
                                <div className="number">100</div>
                                <div className="text">A per B</div>
                            </div>
                            <div className="detail">
                                <div className="number">0.01</div>
                                <div className="text">B per A</div>
                            </div>
                            <div className="detail">
                                <div className="number">100%</div>
                                <div className="text">Share of Pool</div>
                            </div>
                        </div>
                    </div>

                    {/* Swap Button */}
                    <ActionButton onClick={swap} status={getButtonCssClassNameByStatus(state.status, state.fromCoin, state.toCoin)} css={{ marginTop: "16px" }}>
                        {getButtonNameByStatus(state.status, state.fromCoin, state.toCoin)}
                    </ActionButton>
                </SwapWrapper>
            </BaseCard>
        </Wrapper>
    )
}

export default SwapCard