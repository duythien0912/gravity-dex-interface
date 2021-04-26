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

    padding: 0 20px 0 0;
    display: flex;

   background-color: #f77e4a33;
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

            .status {
                font-weight: 600;
                padding-left: 4px;
            }
        }
    }
}


    .result {
        padding: 20px;
        font-size: 20px;

        .title {
            text-align: center;
            margin-bottom: 20px;
        }

        .detail {
            text-align: center;
        }
    }
`
//helpers
function getSuccessMessage(type) {
    switch (type) {
        case 'Redeem':
            return "Redeem Success! 🎉"
        case 'Create':
            return "Pool Created! 🎉"
        case 'Create':
            return "  Add Liquidity Success! 🎉"
        case 'Swap':
            return "Swap Success! 🎉"
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
                        <div className="order" style={{ color: "#F6743C" }}>①</div>
                        <div className="divider" style={{ backgroundColor: "darkgray" }}></div>
                        <div className="order" style={{ color: "darkgray" }}>②</div>
                    </div>
                    <div className="step-details">
                        <div className="detail">Transaction Broadcast - <span className="status">{broadcastStatus.toUpperCase()}</span></div>
                        <div className="detail" style={{ color: "darkgray" }}>Transaction Result - <span className="status">{transactionResultStatus.toUpperCase()}</span></div>
                    </div>
                </div>

                <div className="result">
                    <div className="title">Result</div>
                    <div className="detail">

                        {getSuccessMessage(txModalData.type)}
                    </div>

                </div>


            </SelectCoinWrapper>
        </BasicModal>
    );
}

export default TxProcessingModal