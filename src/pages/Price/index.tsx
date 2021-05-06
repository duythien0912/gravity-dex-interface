// @ts-nocheck
import * as React from 'react'
import styled from "styled-components"
import { cutNumber } from "../../utils/global-functions"
import { useHistory } from 'react-router-dom'
import { chainInfo } from "../../cosmos-amm/config"
import ReactTooltip from 'react-tooltip';
import Tooltip from "../../components/Tooltips/QuestionMarkTooltip"

import DataTable from 'react-data-table-component';
import axios from 'axios';

const columns = [
  {
    name: 'Pool',
    selector: 'poolName',
    format: (row) => {
      return (
        getPoolNameWithCoinImages(row.poolName)
      )
    },
    minWidth: "154px",
    maxWidth: "154px"
  },
  {
    name: <div className="column-with-tooltip">Arbitrage Chance &nbsp;<Tooltip text="Diversion of global ratio and internal ratio results in arbitrage chances" /></div>,
    selector: 'discrepancyRate',
    format: (row) => {


      let color = null
      let isBold = false
      if (row.discrepancyRate < 20) {
        color = '#fff'
      } else if (row.discrepancyRate < 30) {
        color = '#f7d895'
      } else if (row.discrepancyRate < 100) {
        color = '#fa7d08'
      } else {
        color = '#ff0000'
        isBold = true
      }

      return (
      <div onClick={() => {
        row.goSwapPage(`${row.sellCoin}-${row.buyCoin}`)
      }} style={{textAlign: "center"}}>
      <span style={{ color: color, fontWeight: isBold ? '600' : '400' }}>{row.discrepancyRate + '%'}</span>
      <div style={{marginTop: "4px"}}> <span style={{color:"rgb(2, 192, 118)", fontWeight:"bold"}}>Buy</span> {row.buyCoin} / <span style={{ color: "rgb(248, 73, 96)", fontWeight:"bold"}}>Sell</span> {row.sellCoin}</div>
      </div>
      )

    },
    minWidth: "220px",
    sortable: true,
    center: true,
  },
  {
    name: <div className="column-with-tooltip">APY &nbsp;<Tooltip text="Annual percentage yield (1 hr)" /></div>,
    selector: 'apy',
    minWidth: "120px",
    maxWidth: "120px",
    sortable: true,
    format: row => `${cutNumber(row.apy * 100, 2)}%`,
    right: true,
  },
  {
    name: <div className="column-with-tooltip">Fees &nbsp;<Tooltip text="USD value of pool swap fee earning (1 hr)" /></div>,
    selector: 'swapFee',
    minWidth: "120px",
    sortable: true,
    format: row => `$${row.swapFee}`,
    right: true,
  },
  {
    name: <div className="column-with-tooltip">Global Price &nbsp;<Tooltip text="USD price on the rule" /></div>,
    selector: 'xGlobalPrice',
    minWidth: "160px",

    right: true,
  },
  {
    name: <div className="column-with-tooltip">Global Price Ratio &nbsp;<Tooltip text="Price ratio calculated from global price" /></div>,
    selector: 'globalRatio',
    right: true,
    minWidth: "210px"
  },
  {
    name: <div className="column-with-tooltip">Internal Price Ratio &nbsp;<Tooltip text="Pool price ratio" /></div>,
    selector: 'internalRatio',
    minWidth: "210px",
    right: true,
  }
]

//Styled-components
const Wrapper = styled.div`
width: 100%;
max-width: 1340px;
margin: 0 auto;

padding: 0 30px;
/* border-radius: 20px; */
.table {
  
  &::-webkit-scrollbar {
    height: 10px;
    display: block;
  }
 
&::-webkit-scrollbar-track {
  background-color:hsla(0, 3.0769230769230664%, 74.50980392156863%, 0.39);
  border-radius: 8px;
}
 
&::-webkit-scrollbar-thumb {
  background-color: hsla(18.064516129032256, 91.17647058823533%, 60%, 0.664);
  border-radius: 8px;

  &:hover {
    background-color: rgb(246, 116, 60);
  }
}
  padding-bottom: 10px;
  margin-bottom: 10px;

    /* transform:rotateX(180deg);
    -moz-transform:rotateX(180deg); 
    -webkit-transform:rotateX(180deg); 
    -ms-transform:rotateX(180deg);
    -o-transform:rotateX(180deg); */
    
  .rdt_Table {
    background-color: rgba(0, 0, 0, 0.5);
    max-height: 73vh;

    
    /* transform:rotateX(180deg);
    -moz-transform:rotateX(180deg); 
    -webkit-transform:rotateX(180deg); 
    -ms-transform:rotateX(180deg);
    -o-transform:rotateX(180deg); */

    .pair-price {
      padding: 10px 0;
      text-align: right;
      line-height: 1.7;
    }
    
    .coin-image {
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background-color: #fff;
    }

    .pool-name {
      display: flex;
      align-items: center;
    }
   
  }
  .rdt_TableHeader, .rdt_TableHead, .rdt_TableRow, .rdt_TableHeadRow{
    background-color: transparent;
    color: #fff !important;
  }

  .rdt_TableRow {
    min-height: 56px;
  }

  .rdt_TableHead {
    border: 1px solid#F6743C;
    border-radius: 4px;
  }
  

  .rdt_TableCol  {
    color: #F6743C;
    font-weight: 600;
    font-size: 16px;
  }

  .rdt_TableCol_Sortable{
    color: #fff !important;
    span {
      color: #fff;
    }
  }
}

.rdt_TableHeader {
    background-color: transparent;
    color: #fff;
    font-size: 20px;
    font-weight: bold;
    padding-left: 0;
    margin-bottom: 12px;

   & > div {
     width: 100%;
   }
  }

.tradingButton {
  background-color: transparent;
  width: 64px;
  height: 28px;
  margin-left: 12px;
  border-radius: 4px;
  outline: none;
  border: 1px solid #f58352;
  cursor: pointer;
  color: #f58352;

  &:hover {
    border: 1px solid #e6b587;
    color:  #e6b587;
  }

}

.rdt_TableBody {
  max-height: 100%;
  height: 100%;

  &::-webkit-scrollbar {
   width: 10px;
    display: block;
  }
 
&::-webkit-scrollbar-track {
  background-color:hsla(0, 3.0769230769230664%, 74.50980392156863%, 0.39);
  border-radius: 8px;
}
 
&::-webkit-scrollbar-thumb {
  background-color: hsla(18.064516129032256, 91.17647058823533%, 60%, 0.664);
  border-radius: 8px;
  
  &:hover {
    background-color: rgb(246, 116, 60);
  }
}
}

.rdt_TableRow:hover {
outline: none;
border-bottom: 1px solid transparent;

background-color: hsla(36, 100%, 50%, 0.295) !important;
}

.column-with-tooltip {
  display: flex;
  align-items: center;
}
`
const CoinPrice = styled.div`
width: 300px;
height: auto;
/* background-color: #555; */
.title {
  text-align:center;
  font-size: 16px;
  font-weight: bold;
  margin: 12px 0;
}

.sub-title {
  font-weight: bold;
  margin-bottom: 20px;
}

.details {
  border: 1px solid gray;
  padding: 8px;
  margin-bottom: 20px;

  .detail {
    padding: 4px;
    line-height: 1.5;
  }

  a {
    text-decoration: none;
    color: #fff;
    font-weight: normal;
  }
  img {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    margin-bottom: -4px;
    background-color:#fff;
  }

  .bold {
    font-weight: bold;
  }
}
`

const PoolSelector = styled.div`
display: flex;

max-width: 1172px;
flex-wrap: wrap;
.coin {
  margin-top: 12px;
  font-size: 12px;
  display: flex;
  align-items: center;
  padding: 4px 8px;
  border: 1px solid gray;
  border-radius: 20px;
  margin-right: 12px;
  cursor: pointer;

  &:hover {
    border-color: rgb(246, 116, 60);
  }
  
  img {
    background-color: #fff;
    border-radius: 50%;
    width: 14px;
    height: 14px;
    margin-right: 4px;
  }
}

.selected {
  border-color: rgb(246, 116, 60) !important;
}
`

//helpers 
function getPoolNameWithCoinImages(poolName) {
  if (!poolName) return 'Loading'
  const coins = poolName.toLowerCase()?.split('-')
  // console.log(coins)
  return (
    <div className="pool-name"  >
      <img src={`/assets/coins/${coins[0]}.png`} alt="pool coin A" className="coin-image" />
      <img src={`/assets/coins/${coins[1]}.png`} alt="pool coin B" className="coin-image" />
      &nbsp;{poolName}
    </div>
  )
}

function Table() {
  const [tableData, setTableData] = React.useState([{ id: 1, title: '', }])
  const [searchWord, setSearchWord] = React.useState([])
  const history = useHistory();

  function getCoinNameWithImage(coin) {
    if (coin === "all") {
      return (<div className={`coin ${searchWord.length === 0 ? 'selected' : ''}`} onClick={() => {
        setSearchWord([])
      }}>{coin.toUpperCase()}</div>)
    }

    return (<div className={`coin ${searchWord.includes(coin.toUpperCase()) ? 'selected' : ''}`} onClick={() => {
      let index = searchWord.indexOf(coin.toUpperCase())
      if (index !== -1) {
        setSearchWord(a => {
          let newArray = [...a]
          newArray.splice(index, 1)
          return newArray
        })
        return
      }
      setSearchWord(a => [...a, coin.toUpperCase()])
    }}><img src={`/assets/coins/${coin}.png`} alt="search pool" /> {coin.toUpperCase()}</div>)
  }

  const title = <div style={{ maxWidth: "1172px" }}>Pool Price
 <div data-tip data-for="coin-price" data-event="click" style={{
      padding: "4px 12px",
      display: "inline-block",
      marginLeft: "12px",
      fontSize: " 15px",
      color: "#fff",
      backgroundColor: "#F6743C",
      border: "1px solid #F6743C",
      borderRadius: "20px",
      cursor: "pointer"
    }}>
      Coin Price Evaluation Rule
  </div>
    <ReactTooltip id="coin-price" place="bottom" type="dark" effect="solid" clickable={true}>
      <CoinPrice>
        <div className="title">Coin Price</div>
        <div className="sub-title">Evaluation of tokens in USD at the end of competition</div>

        <div className="details">
          <div className="detail"> - BITSONG<img src="/assets/coins/btsg.png" alt="coin" />(BTSG), SENTINEL<img src="/assets/coins/dvpn.png" alt="coin" />(DVPN), PERSISTENCE<img src="/assets/coins/xprt.png" alt="coin" />(XPRT), AKASH<img src="/assets/coins/akt.png" alt="coin" />(AKT), TERRA<img src="/assets/coins/luna.png" alt="coin" />(LUNA), E-Money<img src="/assets/coins/ngm.png" alt="coin" />(NGM), IRIS<img src="/assets/coins/iris.png" alt="coin" />(IRIS), ATOM<img src="/assets/coins/atom.png" alt="coin" />(ATOM) : <span className="bold">coinmarketcap price in USD</span></div>
          <div className="detail"> - CYBER<img src="/assets/coins/gcyb.png" alt="coin" />(GCYB) : <span className="bold">ICO price at <a href="https://cyber.page/port/progress" target="_blank" rel="noopener noreferrer">(https://cyber.page/port/progress)</a></span></div>
          <div className="detail"> - REGEN<img src="/assets/coins/regen.png" alt="coin" />(REGEN), DESMOS(DSM)<img src="/assets/coins/dsm.png" alt="coin" /> :  <span className="bold">Random price generation by B-Harvest, starting at 10 USD</span></div>
          <div className="detail"> - RUN<img src="/assets/coins/run.png" alt="coin" />(RUN) : <span className="bold">Fixed price at 1 USD</span></div>
          <div className="detail"> - COM<img src="/assets/coins/com.png" alt="coin" />(COM) :  <span className="bold">1 EUR in USD</span></div>
        </div>
      </CoinPrice>
    </ReactTooltip>

    <PoolSelector>
      {getCoinNameWithImage('all')}
      {getCoinNameWithImage('atom')}
      {getCoinNameWithImage('akt')}
      {getCoinNameWithImage('btsg')}
      {getCoinNameWithImage('com')}
      {getCoinNameWithImage('dsm')}
      {getCoinNameWithImage('dvpn')}
      {getCoinNameWithImage('gcyb')}
      {getCoinNameWithImage('iris')}
      {getCoinNameWithImage('luna')}
      {getCoinNameWithImage('ngm')}
      {getCoinNameWithImage('xprt')}
      {getCoinNameWithImage('run')}
      {getCoinNameWithImage('regen')}
    </PoolSelector>
  </div>
  // eslint-disable-next-line

  React.useEffect(() => {
    let intervalId = null
    getPriceData()
    intervalId = setInterval(() => {
      getPriceData()
    }, 10000)

    async function getPriceData() {
      let priceData = [];
      const response = await axios.get(`${chainInfo.competitionInfoBaseUrl}/pools`)
      // console.log(response.data.pools)
      response.data.pools.forEach((pool, index) => {

        const xCoinName = `${pool.reserveCoins[0].denom.substr(1).toUpperCase()}`
        const yCoinName = `${pool.reserveCoins[1].denom.substr(1).toUpperCase()}`
        const poolName = `${xCoinName}-${yCoinName}`

        if (searchWord.length !== 0) {
          if (searchWord.includes(xCoinName) || searchWord.includes(yCoinName)) {
            // console.log('render', poolName)
          } else {
            return
          }
        }


        const apy = pool.apy

        const xGlobalPrice = Number(cutNumber(pool.reserveCoins[0].globalPrice * 1000000, 4))
        const yGlobalPrice = Number(cutNumber(pool.reserveCoins[1].globalPrice * 1000000, 4))

        const globalRatio = pool.reserveCoins[0].globalPrice / pool.reserveCoins[1].globalPrice
        const internalRatio = pool.reserveCoins[1].amount / pool.reserveCoins[0].amount

        const swapFee = Math.ceil((apy / (24 * 365)) * pool.poolCoin.amount * pool.poolCoin.globalPrice * 100) / 100

        const discrepancyRate = (globalRatio / internalRatio) - 1 > 0 ? (globalRatio / internalRatio) - 1 : ((globalRatio / internalRatio) - 1) * -1
        let buyCoin = null
        let sellCoin = null
        //TEST-CODE
          if(globalRatio > internalRatio) {
            console.log(poolName, "global 비쌈")
            console.log(`buy ${xCoinName} sell ${yCoinName}`)
            buyCoin = xCoinName
            sellCoin = yCoinName
          } else {
            buyCoin = yCoinName
            sellCoin = xCoinName
          }
        //TEST-CODE

        if (!isNaN(internalRatio)) {
          priceData.push({
            id: index,
            poolName: poolName,
            swapFee: swapFee,
            buyCoin: buyCoin,
            sellCoin: sellCoin,
            apy: apy,
            xGlobalPrice: (<div className="pair-price" onClick={() => {
              goSwapPage(poolName)
            }}>
              <div>${xGlobalPrice} {poolName?.split('-')[0]}</div>
              <div>${yGlobalPrice} {poolName?.split('-')[1]}</div>
            </div>),
            yGlobalPrice: yGlobalPrice,
            globalRatio: (
              <div className="pair-price" onClick={() => {
                goSwapPage(poolName)
              }}>
                <div>{cutNumber(globalRatio, 4)} {yCoinName} per {xCoinName}</div>
                <div>{cutNumber(1 / globalRatio, 4)} {xCoinName} per {yCoinName}</div>
              </div>),
            internalRatio: (
              <div className="pair-price" onClick={() => {
                goSwapPage(poolName)
              }}>
                <div>{cutNumber(internalRatio, 4)} {yCoinName} per {xCoinName}</div>
                <div>{cutNumber(1 / internalRatio, 4)} {xCoinName} per {yCoinName}</div>
              </div>
            ),
            discrepancyRate: Number(`${cutNumber(discrepancyRate * 100, 2)}`),
            history: history,
            goSwapPage: goSwapPage
          })
        }
      })

      setTableData(priceData)

      //helper
      function goSwapPage(poolName) {
        const pairA = poolName?.split('-')[0].toLowerCase()
        const pairB = poolName?.split('-')[1].toLowerCase()
        history.push(`/swap?from=${pairA}&to=${pairB}`)
      }

    }
    return () => clearInterval(intervalId)
  }, [history, searchWord])

  return (
    <Wrapper>
      {tableData !== null ? <DataTable
        title={title}
        className="table"
        defaultSortField="discrepancyRate"
        defaultSortAsc={false}
        onRowClicked={(row) => {
          row.history.push(`/swap?from=${row.sellCoin}&to=${row.buyCoin}`)
        }}
        pointerOnHover={true}
        highlightOnHover={true}
        columns={columns}
        data={tableData}
        fixedHeader={true}
      /> : <div>No data</div>}
    </Wrapper>
  )
}

export default Table