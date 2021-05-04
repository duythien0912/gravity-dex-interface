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
    minWidth: "120px",
    maxWidth: "140px"
  },
  {
    name: <div className="column-with-tooltip">APY &nbsp;<Tooltip text="Annual percentage yield (updated every hour)" /></div>,
    selector: 'apy',
    minWidth: "120px",
    maxWidth: "120px",
    sortable: true,
    format: row => `${cutNumber(row.apy * 100, 2)}%`,
    right: true,
  },
  {
    name: <div className="column-with-tooltip">Global Price &nbsp;<Tooltip text="USD price on coinmarketcap" /></div>,
    selector: 'xGlobalPrice',
    minWidth: "160px",
    format: row => `$${row.xGlobalPrice} ${row?.poolName?.split('-')[0]}`,
    right: true,
  },
  {
    name: <div className="column-with-tooltip">Global Price &nbsp;<Tooltip text="USD price on coinmarketcap" /></div>,
    selector: 'yGlobalPrice',
    minWidth: "160px",
    format: row => `$${row.yGlobalPrice} ${row?.poolName?.split('-')[1]}`,
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

      return <span style={{ color: color, fontWeight: isBold ? '600' : '400' }}>{row.discrepancyRate + '%'}</span>

    },
    minWidth: "220px",
    sortable: true,
    right: true,
  },
];

//Styled-components
const Wrapper = styled.div`
width: 100%;
max-width: 1340px;
margin: 0 auto;

padding: 0 30px 60px 30px;
/* border-radius: 20px; */
.table {
  .rdt_Table {
    background-color: rgba(0, 0, 0, 0.5);
   
  }
  .rdt_TableHeader, .rdt_TableHead, .rdt_TableRow, .rdt_TableHeadRow{
    background-color: transparent;
    color: #fff !important;
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
}

.rdt_TableRow:hover {
outline: none;
border: none;
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



function Table() {
  const [tableData, setTableData] = React.useState([{ id: 1, title: 'Conan the Barbarian', year: '1982' }])
  const history = useHistory();
  const title = <div>Pool Price
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
      console.log(response.data.pools)
      response.data.pools.forEach((pool, index) => {
        const xCoinName = `${pool.reserveCoins[0].denom.substr(1).toUpperCase()}`
        const yCoinName = `${pool.reserveCoins[1].denom.substr(1).toUpperCase()}`
        const poolName = `${xCoinName}-${yCoinName}`
        const apy = pool.apy

        const xGlobalPrice = Number(cutNumber(pool.reserveCoins[0].globalPrice * 1000000, 4))
        const yGlobalPrice = Number(cutNumber(pool.reserveCoins[1].globalPrice * 1000000, 4))

        const globalRatio = pool.reserveCoins[0].globalPrice / pool.reserveCoins[1].globalPrice
        const internalRatio = pool.reserveCoins[1].amount / pool.reserveCoins[0].amount

        const discrepancyRate = (globalRatio / internalRatio) - 1 > 0 ? (globalRatio / internalRatio) - 1 : ((globalRatio / internalRatio) - 1) * -1

        if (!isNaN(internalRatio)) {
          priceData.push({
            id: index,
            poolName: poolName,
            apy: apy,
            xGlobalPrice: xGlobalPrice,
            yGlobalPrice: yGlobalPrice,
            globalRatio: `${cutNumber(globalRatio, 4)} ${yCoinName} per ${xCoinName}`,
            internalRatio: `${cutNumber(internalRatio, 4)} ${yCoinName} per ${xCoinName}`,
            discrepancyRate: Number(`${cutNumber(discrepancyRate * 100, 2)}`),
            history: history
          })
        }
      })

      setTableData(priceData)
    }

    return () => clearInterval(intervalId)
  }, [history])

  return (
    <Wrapper>
      {tableData !== null ? <DataTable
        title={title}
        className="table"
        defaultSortField="discrepancyRate"
        defaultSortAsc={false}
        onRowClicked={(row) => {
          const pairA = row?.poolName?.split('-')[0].toLowerCase()
          const pairB = row?.poolName?.split('-')[1].toLowerCase()
          row.history.push(`/swap?from=${pairA}&to=${pairB}`)
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