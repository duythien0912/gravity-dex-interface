import * as React from 'react'
import { useSelector } from "react-redux"
// useDispatch,
import BasicModal from "./BasicModal"
import styled from "styled-components"
import { cosmosSelector } from "../../modules/cosmosRest/slice"
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
    height: 150px;

    padding: 0 20px;
    display: flex;

    border: 1px solid #812056;
    border-radius: 8px;
    margin: 0 20px;
    
    .step-orders {
        width: 60px;
        height: 148px;

        .order {
            /* border: 1px solid black; */
            border-radius: 50%;
            
            width: 24px;
            /* height: 24px; */
            text-align: center;
            margin: 0 auto;
            
            &:first-child {
                margin-top: 28px;
            }
        }

        .divider {
            width: 1px;
            height: 53px;
            background-color: black;
            margin: 0 auto;
        }
    }

    .step-details {
      
        height: 148px;
        flex: 1;
        padding-left: 20px;
        .detail {
            display:flex;
            align-items: center;
            height: 74px;
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
    }
`

function TxProcessingModal({ isOpen, toggle }: { isOpen: boolean, toggle: any, }) {
    const [searchKeyword, setSearchKeyword] = React.useState('')
    const { userBalances } = useSelector(cosmosSelector.all);

    React.useEffect(() => {
        setSearchKeyword('')
    }, [isOpen])



    return (

        <BasicModal elementId="modal" isOpen={isOpen} toggle={toggle}>
            <SelectCoinWrapper>
                <div className="header">
                    <div className="title">Transaction Steps</div>
                    <div className="close" onClick={() => { toggle() }}>X</div>
                </div>

                <div className="wrapper">
                    <div className="step-orders">
                        <div className="order" style={{ color: "#F6743C" }}>①</div>
                        <div className="divider" style={{ backgroundColor: "darkgray" }}></div>
                        <div className="order" style={{ color: "darkgray" }}>②</div>
                    </div>
                    <div className="step-details">
                        <div className="detail">Swap Broadcast : PENDING</div>
                        <div className="detail" style={{ color: "darkgray" }}>Transaction Result : WAITING</div>
                    </div>
                </div>

                <div className="result">
                    <div className="title">Result</div>
                    <div>Pool Created!</div>
                    <div>Redeem Success!</div>
                    <div>Add Liquidity Success!</div>
                    <div>Swap Success</div>
                </div>


            </SelectCoinWrapper>
        </BasicModal>
    );
}

export default TxProcessingModal