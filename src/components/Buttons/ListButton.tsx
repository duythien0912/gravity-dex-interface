import * as React from 'react';
import styled from "styled-components";
import ReactTooltip from 'react-tooltip';

const ThreeDot = styled.div`
    width: 40px;
    height: 40px;
    padding: 8px;
    margin-left: 8px;
    border: none;
    border-radius: 12px;
    background-color: transparent;
    color: #fff;
    cursor:pointer;

    background-color:#F6743C;

    &:hover {
        opacity: 0.8;
    }
`

const Board = styled.div`
font-size: 16px;

.row {
    text-decoration:none;
    display: flex;
    align-items: center;
    padding: 6px 0;
    color: rgba(255, 255, 255, 0.623);
    .icon{
        height: 16px;
        margin-right: 8px;
    }

    .rule {
        path {
            fill: rgba(255,255,255,0.623);
        }
    }

    &:visited {
        color: rgba(255, 255, 255, 0.623);
    }

    &:hover {
        color: #fff;
        .rule {
            path {
                fill: #fff;
            }
        }
    }
}
`

function ListButton({ onClick }) {
    return (
        <>
            <ThreeDot data-tip data-for="1" data-event='click' data-offset="{'bottom': 5, 'left': 30}">
                <div style={{ height: "16px" }} >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="sc-jbKcbu bOyUwa"><path d="M12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path><path d="M19 13C19.5523 13 20 12.5523 20 12C20 11.4477 19.5523 11 19 11C18.4477 11 18 11.4477 18 12C18 12.5523 18.4477 13 19 13Z" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path><path d="M5 13C5.55228 13 6 12.5523 6 12C6 11.4477 5.55228 11 5 11C4.44772 11 4 11.4477 4 12C4 12.5523 4.44772 13 5 13Z" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                </div>


            </ThreeDot>
            <ReactTooltip id="1" place="bottom" type="dark" effect="solid" clickable={true}>
                <Board>

                    <a className="row" href="https://medium.com/tendermint/gravity-dex-competition-guide-fcac06e94762" target="_blank" rel="noopener noreferrer">
                        <div className="icon" ><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg></div>
                        <div className="title">Guide</div>
                    </a>
                    <a className="row" href="https://bharvest.medium.com/4-things-you-should-know-about-gravity-dex-competition-784be6643d4f" target="_blank" rel="noopener noreferrer">
                        <div className="icon rule" >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" width="16" height="16" viewBox="0 0 512 512">
                                <path d="M488 272h-27.056l-36-72H436a36 36 0 000-72h-56l-4.8-6.4A64.306 64.306 0 00324 96h-28a24.039 24.039 0 00-16-22.624V40a24 24 0 00-48 0v33.376A24.039 24.039 0 00216 96h-28a64.307 64.307 0 00-51.2 25.6L132 128H76a36 36 0 000 72h11.056l-36 72H24a8 8 0 00-8 8v16a64.072 64.072 0 0064 64h64a64.072 64.072 0 0064-64v-16a8 8 0 00-8-8h-27.056l-48-96H152a8.002 8.002 0 006.4-3.2l14.4-19.2A24.114 24.114 0 01192 144h24a8 8 0 008 8h8v229.578l-12.283 18.424A39.782 39.782 0 00184 422.112L179.056 432H152a56.063 56.063 0 00-56 56 8 8 0 008 8h304a8 8 0 008-8 56.063 56.063 0 00-56-56h-27.056L328 422.11a39.783 39.783 0 00-35.717-22.108L280 381.578V152h8a8 8 0 008-8h24a24.114 24.114 0 0119.2 9.6l14.4 19.2a8.002 8.002 0 006.4 3.2h27.056l-48 96H312a8 8 0 00-8 8v16a64.072 64.072 0 0064 64h64a64.072 64.072 0 0064-64v-16a8 8 0 00-8-8zM256 32a8.01 8.01 0 018 8v32h-16V40a8.01 8.01 0 018-8zm-64 264a48.054 48.054 0 01-48 48H80a48.054 48.054 0 01-48-48v-8h160zM68.944 272L112 185.888 155.056 272zM192 128a40.191 40.191 0 00-32 16l-12 16H72v16h27.056l-4 8H76a20 20 0 010-40h60a8.002 8.002 0 006.4-3.2l7.2-9.6A48.226 48.226 0 01188 112h28v16zm207.196 352H112.804A40.07 40.07 0 01152 448h208a40.07 40.07 0 0139.196 32zm-85.507-50.733l1.367 2.733H196.944l1.367-2.733A23.87 23.87 0 01219.777 416h72.446a23.87 23.87 0 0121.466 13.267zm-48.345-40.83L273.052 400h-34.104l7.708-11.563A8 8 0 00248 384V152h16v232a8 8 0 001.344 4.438zM280 136h-48V96a8.01 8.01 0 018-8h32a8.01 8.01 0 018 8zm72 8a40.191 40.191 0 00-32-16h-24v-16h28a48.225 48.225 0 0138.4 19.2l7.2 9.6a8.002 8.002 0 006.4 3.2h60a20 20 0 010 40h-19.056l-4-8H440v-16h-76zm48 41.888L443.056 272h-86.112zM480 296a48.054 48.054 0 01-48 48h-64a48.054 48.054 0 01-48-48v-8h160z"></path>
                            </svg>
                        </div>
                        <div className="title">Rule</div>
                    </a>
                    <a className="row" href="https://gravitydex.io/about" target="_blank" rel="noopener noreferrer">
                        <div className="icon"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg></div>
                        <div className="title">About</div>
                    </a>
                    <a className="row" href="https://gravitydex.io/terms-and-conditions.pdf" target="_blank" rel="noopener noreferrer">
                        <div className="icon"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg></div>
                        <div className="title">{'T&C'}</div>
                    </a>
                </Board>

            </ReactTooltip>
        </>
    );
}

export default ListButton