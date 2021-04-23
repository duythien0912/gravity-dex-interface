import * as React from 'react'
import styled from "styled-components"
import { useSelector } from "react-redux";
import { useHistory } from 'react-router-dom'
import { getSelectedPairsPoolData, cutNumber } from "../../utils/global-functions"
import { cosmosSelector } from "../../modules/cosmosRest/slice"
import { liquiditySelector } from "../../modules/liquidityRest/slice"

import { BroadcastLiquidityTx } from "../../cosmos-amm/tx-client.js"

import BaseCard from "../../components/Cards/BaseCard"
import TokenInputController from "../../components/TokenInputController/index"
import ActionButton from "../../components/Buttons/ActionButton"
import { Range, getTrackBackground } from "react-range";
import { NonExistenceProof } from '@cosmjs/stargate/build/codec/confio/proofs';
//Styled-components
const Wrapper = styled.div`
margin-top: -50px;
margin-bottom: 50px;
  width: 100%;

  @media(max-width: 500px) {
    margin-top: -10px;
    }
`

const CardWrapper = styled.div`
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
        background-color:#f77e4a33;
        color: #F6743C;
        border-radius: 12px;
        width: fit-content;
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
   .easy-amount-set-buttons {
            display:flex;
            justify-content:space-between;
            align-items:center;
            width: 100%;
            padding: 0 20px;

            .button {
                background-color: #f77e4a33;
                color:#ff4d00;
                border: none;
                cursor:pointer; 
                font-size: 16px;

                width: 60px;
                padding: 10px 0;

                border-radius: 8px;
                border: 1px solid transparent;

                &:hover {
                    border: 1px solid #ff4d00;
                }
            }
        }
`

//reducer action types
const TYPES = {
    AMOUNT_CHANGE: 'AMOUNT_CHANGE',
    SET_MAX_AMOUNT: 'SET_MAX_AMOUNT',
    SET_FROM_QUERY: 'SET_FROM_QUERY'
}

//helpers
function getButtonNameByStatus(status, fromCoin, toCoin) {
    if (fromCoin === '' || toCoin === '') {
        return 'Select a coin'
    } else if (status === 'existed') {
        return 'Pool already exists'
    } else if (status === 'empty') {
        return 'Enter an amount'
    } else if (status === 'over') {
        return 'Insufficient balance'
    } else {
        return 'Redeem'
    }
}

function getButtonCssClassNameByStatus(status, fromCoin, toCoin) {
    if (fromCoin === '' || toCoin === '' || status === 'over' || status === 'empty') {
        return 'disabled'
    } else {
        return 'normal'
    }
}


function RedeemCard() {
    const { userBalances, userAddress } = useSelector(cosmosSelector.all);
    const { poolsInfo } = useSelector(liquiditySelector.all)
    const poolsData = poolsInfo?.poolsData

    const [state, dispatch] = React.useReducer(reducer, {
        fromCoin: '',
        toCoin: '',
        fromAmount: '',
        fromReserveAmount: '',
        toAmount: '',
        toReserveAmount: '',
        status: 'empty', // connectWallet, notSelected, empty, over, normal
        amount: [0],
    })


    let coinXAmount = null
    let coinYAmount = null
    let poolPrice = null

    const sortedCoins = [state.fromCoin, state.toCoin].sort()
    if (poolsData && poolsData[`${sortedCoins[0]}/${sortedCoins[1]}`]) {
        const reserveCoins = poolsData[`${sortedCoins[0]}/${sortedCoins[1]}`].reserve_coin_balances
        coinXAmount = reserveCoins[`u${state.fromCoin}`]
        coinYAmount = reserveCoins[`u${state.toCoin}`]
        poolPrice = coinXAmount / coinYAmount
    }

    const history = useHistory();
    React.useEffect(() => {
        const searchParams = new URLSearchParams(history.location.search);
        if (searchParams.has('from')) {
            dispatch({ type: TYPES.SET_FROM_QUERY, payload: { from: searchParams.get('from'), to: searchParams.get('to') } })
        }
    }, [history.location.search])

    //reducer for useReducer
    function reducer(state, action) {
        switch (action.type) {

            case TYPES.AMOUNT_CHANGE:

                return { ...state, amount: action.payload.amount }

            case TYPES.SET_FROM_QUERY:

                return { ...state, fromCoin: action.payload.from, toCoin: action.payload.to }

            default:
                console.log("DEFAULT: REDUCER")
                return state;
        }

        //helpers

    }
    function setAmount(value) {
        dispatch({ type: TYPES.AMOUNT_CHANGE, payload: { amount: value } })
    }

    async function add() {
        const sortedCoins = [state.fromCoin, state.toCoin].sort()
        let isReverse = false
        if (state.fromCoin !== sortedCoins[0]) {
            isReverse = true
        }
        console.log(poolsData[`${sortedCoins[0]}/${sortedCoins[1]}`])
        BroadcastLiquidityTx({
            type: 'msgDeposit',
            data: {
                depositorAddress: userAddress,
                poolId: Number(poolsData[`${sortedCoins[0]}/${sortedCoins[1]}`].id),
                depositCoins: [
                    { denom: 'u' + (isReverse ? state.toCoin : state.fromCoin), amount: String(isReverse ? state.toAmount * 1000000 : state.fromAmount * 1000000) },
                    { denom: 'u' + (isReverse ? state.fromCoin : state.toCoin), amount: String(isReverse ? state.fromAmount * 1000000 : state.toAmount * 1000000) },
                ]
            }
        })
    }
    const STEP = 1;
    const MIN = 0;
    const MAX = 100;
    return (
        <Wrapper>
            <BaseCard>
                <CardWrapper>
                    {/* Header */}
                    <div className="header">
                        <div className="back" onClick={() => { history.push('/pool') }}>←</div>
                        <div className="title">Redeem</div>
                        <div style={{ width: "23px" }}></div>
                    </div>

                    {/* Info */}
                    {/* Info */}
                    <div className="info-box">
                        <span style={{ fontWeight: "bold" }}>Tip:</span> Removing pool tokens converts your position back into underlying tokens at the current rate, proportional to your share of the pool. Accrued fees are included in the amounts you receive.
                    </div>



                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            flexWrap: "wrap",
                            margin: "0 32px 32px"
                        }}
                    >
                        <output style={{ margin: "30px", textAlign: "center", fontSize: "60px", fontWeight: 500 }} id="output">
                            <div style={{ paddingLeft: "30px" }} >{state.amount}%</div>
                        </output>
                        <Range
                            values={state.amount}
                            step={STEP}
                            min={MIN}
                            max={MAX}
                            onChange={(value) => setAmount(value)}
                            renderTrack={({ props, children }) => (
                                <div
                                    onMouseDown={props.onMouseDown}
                                    onTouchStart={props.onTouchStart}
                                    style={{
                                        ...props.style,
                                        height: "36px",
                                        display: "flex",
                                        width: "100%"
                                    }}
                                >
                                    <div
                                        ref={props.ref}
                                        style={{
                                            height: "5px",
                                            width: "100%",
                                            borderRadius: "4px",
                                            background: getTrackBackground({
                                                values: [state.amount],
                                                colors: ["#F6743C", "#ccc"],
                                                min: MIN,
                                                max: MAX
                                            }),
                                            alignSelf: "center"
                                        }}
                                    >
                                        {children}
                                    </div>
                                </div>
                            )}
                            renderThumb={({ props, isDragged }) => (
                                <div
                                    {...props}
                                    style={{
                                        ...props.style,
                                        height: "42px",
                                        width: "42px",
                                        outline: "none",
                                        borderRadius: "50%",
                                        backgroundColor: "rgb(243 164 96)",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        boxShadow: "0px 2px 6px #AAA"
                                    }}
                                >

                                </div>
                            )}
                        />
                    </div>

                    {/* Easy amount set buttons */}
                    <div className="easy-amount-set-buttons">
                        <button onClick={() => { setAmount([25]) }} className="button">25%</button>
                        <button onClick={() => { setAmount([50]) }} className="button">50%</button>
                        <button onClick={() => { setAmount([75]) }} className="button">75%</button>
                        <button onClick={() => { setAmount([100]) }} className="button">Max</button>
                    </div>

                    {/* Swap detail */}
                    <div className="pool-creation-detail">
                        <div className="title">Pool information</div>
                        <div className="details">
                            <div className="detail">
                                <div className="number">{(coinYAmount / coinXAmount) ? parseFloat(cutNumber((coinYAmount / coinXAmount), 4)) : '-'}</div>
                                <div className="text">{state.toCoin.toUpperCase()} per {state.fromCoin.toUpperCase()}</div>
                            </div>
                            <div className="detail">
                                <div className="number">{(coinXAmount / coinYAmount) ? parseFloat(cutNumber((coinXAmount / coinYAmount), 4)) : '-'}</div>
                                <div className="text">{state.fromCoin.toUpperCase()} per {state.toCoin.toUpperCase()}</div>
                            </div>
                            <div className="detail">
                                <div className="number">{(coinXAmount / coinYAmount) ? parseFloat(cutNumber(((state.toAmount * 1000000) / coinYAmount) * 100, 4)) : '-'}%</div>
                                <div className="text">Share of Pool</div>
                            </div>
                        </div>
                    </div>

                    {/* Swap Button */}
                    <ActionButton onClick={add} status={getButtonCssClassNameByStatus(state.status, state.fromCoin, state.toCoin)} css={{ marginTop: "16px" }}>
                        {getButtonNameByStatus(state.status, state.fromCoin, state.toCoin)}
                    </ActionButton>
                </CardWrapper>
            </BaseCard>
        </Wrapper>
    )
}

export default RedeemCard