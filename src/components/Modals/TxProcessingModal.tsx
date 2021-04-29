import * as React from 'react'
import { useSelector } from "react-redux"
// useDispatch,
import BasicModal from "./BasicModal"
import styled from "styled-components"
import { cosmosSelector } from "../../modules/cosmosRest/slice"
import { storeSelector } from "../../modules/store/slice"
import { checkImageExsistence } from "../../utils/global-functions"

const SelectCoinWrapper = styled.div`
@media(max-width: 500px) {
      width: 360px !important; 
}
.header{
    display:flex;
    justify-content: space-between;
    align-items: center;
    
    max-width: 420px;
    width: 420px;
    padding: 20px;
    
    @media(max-width: 500px) {
      width: 360px !important; 
    }
    
    .title {
        font-size: 18px;
        font-weight: 500;
    }

    .close {
        font-size: 20px;
        cursor: pointer;
        &:hover {
            opacity: 0.7;
        }
    }
}

.search {
    display: flex;

    width: calc(100% - 40px);
    margin: 0px;
    padding: 16px;
   
    font-size: 18px;

    outline:none;
    border: 1px solid #acacac;
    border-radius: 20px;

    &:focus {
        border-color: #F6743C;
    }
}

.wrapper {
    height: 90px;
    color: #fff;
    padding: 0 20px 0 0;
    display: flex;

    background-color: rgba(0, 0, 0, 0.8);
    border-radius: 8px;
    margin: 0 20px;
    
    .step-orders {
        width: 60px;
        height: 90px;

        .order {
            /* border: 1px solid black; */
            border-radius: 50%;
            
            width: 24px;
            /* height: 24px; */
            text-align: center;
            margin: 0 auto;
           
            &:first-child {
                margin-top: 14px;
            }
        }

        .divider {
            width: 1px;
            height: 24px;
            background-color: black;
            margin: 0 auto;
        }
    }

    .step-details {
      
        height: 148px;
        flex: 1;
     
        .detail {
            font-weight: 300;
            display:flex;
            align-items: center;
            height: 45px;
            color: #fff;
            .status {
                font-weight: 600;
                padding-left: 4px;
            }
        }
    }
}

.result {
    padding: 20px;
}

.pending {
    color: #f39c1a!important;
}


.success, .green {
    color: #0fe20f !important;
}

.fail, .red {
    color: #ff0808 !important;
}

.bold {
    font-weight: bold;
}
`

const ResultBoard = styled.div`
color: #fff;
background: linear-gradient(91.43deg,#860fa5 0%,#9a4927 100%);
padding: 10px 12px;
border-radius: 8px;

.header {
    text-align: center;
}

.detail {
    display:flex;
    justify-content: space-between;
    padding: 4px 0; 
}

.result-title {
    font-size: 20px;
    text-align: center;
    padding-bottom: 20px;
}
`


//helpers
function getResultMessage(type, result) {
    if (result) {
        console.log('result.data', result)
        if (result.data.success === "success") {
            switch (type) {
                case 'Redeem':
                    return "Redeem Success! 🎉"
                case 'Create':
                    return "Pool Created! 🎉"
                case 'Add Liquidity':
                    return "  Add Liquidity Success! 🎉"
                case 'Swap':
                    const successPercentage = Math.round(result.data.offer_coin_amount / result.data.offer_coin_amount * 100)
                    const paidAmount = result.data.exchanged_offer_coin_amount / 1000000
                    const paidDenom = result.data.offer_coin_denom.startsWith('u') ? result.data.offer_coin_denom.substr(1) : result.data.offer_coin_denom
                    const receivedAmount = Math.floor(result.data.exchanged_offer_coin_amount / result.data.swap_price / 100) / 10000
                    const receivedDenom = result.data.demand_coin_denom.startsWith('u') ? result.data.demand_coin_denom.substr(1) : result.data.demand_coin_denom
                    return (
                        <>
                            <div className="detail">
                                <div className="title">Status : </div>
                                <div className="body">Swap Success <span className="bold">({successPercentage}%)</span></div>
                            </div>
                            <div className="detail">
                                <div className="title">Paid : </div>
                                <div className="body"><span className="red">- {paidAmount}</span> {paidDenom.toUpperCase()}</div>
                            </div>
                            <div className="detail">
                                <div className="title">Received : </div>
                                <div className="body"><span className="green">+ {receivedAmount}</span> {receivedDenom.toUpperCase()}</div>
                            </div>
                        </>
                    )
            }
        } else {
            return <div>{result.data}</div>
        }
    }
}

function TxProcessingModal({ isOpen, toggle }: { isOpen: boolean, toggle: any, }) {

    const { txModalData } = useSelector(storeSelector.all)
    const [broadcastStatus, setBroadcastStatus] = React.useState('pending')
    const [transactionResultStatus, setTransactionResultStatus] = React.useState('waiting')

    React.useEffect(() => {
        setBroadcastStatus(txModalData.broadcastStatus ? txModalData.broadcastStatus : 'pending')
        setTransactionResultStatus(txModalData.transactionResultStatus ? txModalData.transactionResultStatus : 'waiting')
    }, [txModalData])



    return (

        <BasicModal elementId="modal" isOpen={isOpen} toggle={toggle}>
            <SelectCoinWrapper>
                <div className="header">
                    <div className="title">{txModalData.type} Steps</div>
                    <div className="close" onClick={() => { toggle() }}>X</div>
                </div>

                <div className="wrapper">
                    <div className="step-orders">
                        <div className={`order ${broadcastStatus}`} style={{ color: "#F6743C" }}>①</div>
                        <div className="divider" style={{ backgroundColor: broadcastStatus === "success" ? "green" : "darkgray" }}></div>
                        <div className={`order ${transactionResultStatus}`} style={{ color: "darkgray" }}>②</div>
                    </div>
                    <div className="step-details">
                        <div className="detail">Transaction Broadcast - <span className={`status ${broadcastStatus}`}>{broadcastStatus.toUpperCase()}</span></div>
                        <div className={`detail`} style={{ color: transactionResultStatus === "waiting" ? "darkgray" : "#fff" }}>Transaction Result - <span className={`status ${transactionResultStatus}`}>{transactionResultStatus.toUpperCase()}</span></div>
                    </div>
                </div>

                <div className="result">
                    {/* <div className="title">Result</div> */}

                    <ResultBoard>
                        <div className="result-title">RESULT</div>
                        {getResultMessage(txModalData.type, txModalData.resultData)}
                    </ResultBoard>


                </div>


            </SelectCoinWrapper>
        </BasicModal>
    );
}

export default TxProcessingModal