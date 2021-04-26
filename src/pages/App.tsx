import * as React from 'react'
import styled from "styled-components"
import { Route, Switch, useHistory } from 'react-router-dom'
import { useToggle } from "ahooks"
import { ToastContainer, Flip } from "react-toastify";

import AppHeader from "../components/Header"
import Swap from "../pages/Swap"
import Pool from "../pages/Pool"
import Create from "../pages/Create"
import Add from "../pages/Add"
import Redeem from "../pages/Redeem"
import Rank from "../pages/Rank"

import TxProcessingModal from "../components/Modals/TxProcessingModal"

import Background from "../assets/svgs/Background"
//test
// import { testTxGenerator } from "../cosmos-amm/new-cosmos-amm"
// import { test2 } from "../cosmos-amm/new2-cosmos-amm"
// import { testSign } from "../cosmos-amm/new-sign-comsos-amm"
// import { useDispatch, useSelector } from "react-redux";
// import { liquiditySelector, liquidityAction } from "../modules/liquidityRest/slice"
// import { cosmosSelector, cosmosAction } from "../modules/cosmosRest/slice"

//starport liquidity js
import { useDispatch } from "react-redux";
import { liquidityAction } from "../modules/liquidityRest/slice"




const AppWrapper = styled.div`
  display: flex;
  flex-flow: column;
  align-items: flex-start;
  overflow-x: hidden;
  background-color:transparent;

  min-height: 100vh;
  /* background-position: 0px -30vh; */
  /* background-repeat: no-repeat;
  background-image: radial-gradient(50% 50% at 50% 50%,rgb(78 127 236 / 41%) 0%,rgb(167 229 243 / 8%) 100%);

  @media(max-width: 500px) {
    background-image: radial-gradient(50% 50% at 50% 50%,rgb(133 177 232 / 51%) 0%,rgb(201 235 255 / 17%) 100%);
    background-position:0px 0px !important;
  } */
`

const BackgroundWrapper = styled.div`
position:fixed;
transform: translate(-50%, -50%);
top: 50%;
left: 50%;
z-index: -1;

background-color: black;

width: 100vw;
min-width: 1440px;
height: 100vh;
`

const { requestQueryParams, requestQueryLiquidityPools } = liquidityAction;

function App() {
  const history = useHistory();
  const dispatch = useDispatch();
  const [isTxProcessingModalOpen, { toggle: txProcessingModalToggle }] = useToggle(true)
  // const { params, pools } = useSelector(liquiditySelector.all);


  React.useEffect(() => {
    if (window.location.hash === '#/') {
      history.push('/swap')
    }
    dispatch(requestQueryParams())
    setInterval(() => {
      dispatch(requestQueryLiquidityPools())
    }, 7000)
    dispatch(requestQueryLiquidityPools())
    console.log('render')


  }, [history, dispatch])

  return (
    <AppWrapper>
      <BackgroundWrapper>
        <Background />
      </BackgroundWrapper>
      <AppHeader />

      <Switch>
        <Route exact strict path={["/", "/swap"]} component={Swap} />
        <Route exact strict path="/pool" component={Pool} />
        <Route exact strict path="/create" component={Create} />
        <Route exact strict path="/add" component={Add} />
        <Route exact strict path="/redeem" component={Redeem} />
        <Route exact strict path="/rank" component={Rank} />
      </Switch>

      <ToastContainer
        limit={1}
        transition={Flip}
        position="bottom-left"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop closeOnClick
        rtl={false} pauseOnFocusLoss
        draggable pauseOnHover />

      <TxProcessingModal isOpen={isTxProcessingModalOpen} toggle={txProcessingModalToggle} />

    </AppWrapper>
  );
}

export default App;
