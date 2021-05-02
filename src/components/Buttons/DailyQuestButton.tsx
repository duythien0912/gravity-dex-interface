import * as React from 'react';
import styled from "styled-components";
import ReactTooltip from 'react-tooltip';

import { chainInfo } from "../../cosmos-amm/config"
import { cosmosSelector } from "../../modules/cosmosRest/slice"
import { useSelector } from "react-redux";
import axios from 'axios';

const Wrapper = styled.div`
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 52px;
    height: 52px;
    padding: 0;
    margin-left: 8px;
    border: 1px solid transparent;
    border-radius: 52px;
    background-color: transparent;
    cursor:pointer;

    .wave {
        position: absolute;
        text-align: center;
        top: 0;
        right: 0;
        width: 52px;
        height: 52px;
        border-radius: 50%;
        border: 1px solid #fff;
        /* background-color: #2d3436; */
        opacity: 0;
        z-index: -1;
        pointer-events: none;
        
    }

    &:hover {
       .wave {
        animation: Waveeffects .5s linear 1;
       }
    }

    @keyframes Waveeffects {
        0% {
            opacity: 0.4;
        }
        100% {
            transform: scale(2.4);
            opacity: 0;
        }
    }
`

const ToolTipWrapper = styled.div`
  .place-top {
       &::after {
           left: 95% !important;
           border-top-color:rgb(89 59 95) !important;
          
       }
    }

    .__react_component_tooltip {
        padding: 0;
        border-radius: 4px;
        opacity: 1 !important;
        border:none;
    }
`

const QuestBoard = styled.div`
width: 400px;
height: 500px;
padding: 20px;
border: 2px solid rgb(89 59 95);
background-color: rgb(15, 6, 17);
border-radius: 4px;
.title {
    font-size: 20px;
    width: 140px;
    text-align: center;
    display: block;
    margin: 0 auto;

    .title-underline {
        width: 100%;
        height: 3px;
        margin-top: 5px;
        border-radius: 4px;
        background: purple;
    }
}

.quest-subtitle {
    text-align: center;
    margin-top: 12px;
}

.quests {
    margin-top: 12px;

    .complete {
        background-color: #178a45;
    }

    .quest{
        text-align: center;
        border: 1px solid rgb(142 140 140 / 80%);
        margin-top: 20px;
        border-radius: 4px;
        padding: 12px;
        font-size: 16px;
        &-title {
            padding-bottom: 12px;
            border-bottom: 1px solid #4b4a4a;
        }
        &-counting {
            padding: 12px 0;
            
        }
        &-progress-bar {
            position: relative;
            height: 8px;
            width: 80%;
            background: hsla(0, 0%, 37.254901960784316%, 0.349);
            margin: 0 auto;
            &__percent{
                width: 40%;
                height: 8px;
                background:linear-gradient(91.43deg,#890FA8 0%,#F6743C 100%);
            }
        }
    }
}

.mission-status {
    margin-top: 30px ;
    text-align: center;
    font-size: 20px;
    font-weight: bold;
}
`

function DailyQuestButton() {
    // const { userAddress } = useSelector(cosmosSelector.all);
    const [statusData, setStatusData] = React.useState({
        swapCount: 0,
        depositCount: 0,
    })
    async function getUserDailyQuestStatus() {
        // const response = await axios.get(`${chainInfo.competitionInfoBaseUrl}/actions?address=${userAddress}`)
        // return response
        const response = {
            blockHeight: 111111,
            deposit: {
                numDifferentPools: 3,
                todayCount: 3,
                todayMaxCount: 3,
            },
            swap: {
                numDifferentPools: 3,
                todayCount: 2,
                todayMaxCount: 3,
            },
            updatedAt: "1234-12-12"
        }
        setStatusData({ swapCount: response.swap.todayCount > 3 ? 3 : response.swap.todayCount, depositCount: response.deposit.todayCount > 3 ? 3 : response.deposit.todayCount })
    }

    return (
        <>
            <Wrapper data-tip data-for="quest" data-event='click' data-offset="{'top': 10, 'left': 180}">
                <div className="wave" />
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    data-author="Icon made by Freepik from www.flaticon.com"
                    x="0"
                    y="0"
                    enableBackground="new 0 0 512 512"
                    version="1.1"
                    viewBox="0 0 512 512"
                    xmlSpace="preserve"
                >
                    <circle cx="256" cy="256" r="256" fill="#a53fb8"></circle>
                    <path
                        fill="#a53fb8"
                        d="M512 256c0-16.341-1.55-32.319-4.476-47.809L384.333 85l-17.015 32.318-44.985-44.985-194.666 345.334 91.715 91.715A258.138 258.138 0 00256 512c141.385 0 256-114.615 256-256z"
                    ></path>
                    <path
                        fill="#FABF2D"
                        d="M127.67 85H384.34000000000003V417.67H127.67z"
                    ></path>
                    <path fill="#F8A725" d="M255.95 85H384.33V417.67H255.95z"></path>
                    <path fill="#FFF" d="M150.33 105.58H361.66V397.08H150.33z"></path>
                    <path
                        fill="#EBEEF0"
                        d="M255.95 105.58H361.65999999999997V397.08H255.95z"
                    ></path>
                    <path fill="#FEF076" d="M189.67 72.33H322.34V114.33H189.67z"></path>
                    <path fill="#FED500" d="M255.95 72.33H322.33V114.33H255.95z"></path>
                    <path fill="#98B4B6" d="M231 173.54H339.5V185.04H231z"></path>
                    <path fill="#819899" d="M255.95 173.54H339.5V185.04H255.95z"></path>
                    <path fill="#98B4B6" d="M231 242.54H339.5V254.04H231z"></path>
                    <path fill="#819899" d="M255.95 242.54H339.5V254.04H255.95z"></path>
                    <path fill="#98B4B6" d="M231 311.54H339.5V323.04H231z"></path>
                    <path fill="#819899" d="M255.95 311.54H339.5V323.04H255.95z"></path>
                    <g fill="#83E276">
                        <path d="M184.732 201.981L164.367 180.161 176.795 168.562 185.561 177.954 210.38 154.79 221.979 167.218z"></path>
                        <path d="M184.732 270.267L164.367 248.446 176.795 236.847 185.561 246.239 210.38 223.075 221.979 235.503z"></path>
                        <path d="M184.732 338.552L164.367 316.731 176.795 305.132 185.561 314.524 210.38 291.36 221.979 303.788z"></path>
                    </g>
                </svg>
            </Wrapper >

            <ToolTipWrapper>
                <ReactTooltip
                    id="quest"
                    place="top"
                    type="dark"
                    effect="solid"
                    clickable={true}
                    afterShow={() => {
                        getUserDailyQuestStatus()
                    }}
                >
                    <QuestBoard>
                        <div className="title">
                            Daily Missions
                            <div className="title-underline" />
                        </div>

                        <div className="quest-subtitle">
                            Every day you receive missions
                        </div>

                        <div className="quests">
                            <div className={`quest ${statusData.swapCount === 3 ? 'complete' : ''}`} >
                                <div className="quest-title">
                                    1. Swap 3 times in different pools
                                </div>
                                <div className="quest-counting">
                                    {statusData.swapCount} / 3
                                </div>
                                <div className="quest-progress-bar" >
                                    <div className="quest-progress-bar__percent" style={{ width: `${statusData.swapCount / 3 * 100}%` }} />
                                </div>
                            </div>

                            <div className={`quest ${statusData.depositCount === 3 ? 'complete' : ''}`}>
                                <div className="quest-title">
                                    2. Deposit 3 times in different pools
                                </div>
                                <div className="quest-counting">
                                    {statusData.depositCount} / 3
                                </div>
                                <div className="quest-progress-bar" >
                                    <div className="quest-progress-bar__percent" style={{ width: `${statusData.depositCount / 3 * 100}%` }} />
                                </div>
                            </div>
                        </div>

                        <div className="mission-status">
                            {statusData.depositCount + statusData.swapCount === 6 ? `COMPLETE ` : "Mission in progress 🚀"}
                        </div>

                        <div className="time-left">
                            Time Left : 9 hour 21min
                        </div>
                    </QuestBoard>
                </ReactTooltip>
            </ToolTipWrapper>
        </>
    );
}

export default DailyQuestButton