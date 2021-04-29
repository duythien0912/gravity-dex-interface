// @ts-nocheck
import * as React from 'react'
import styled from "styled-components"
import { useSelector } from "react-redux";
import { cutNumber } from "../../utils/global-functions"
import { useHistory } from 'react-router-dom'

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
    name: 'Global Price',
    selector: 'xGlobalPrice',
    minWidth: "150px",
    format: row => `$${row.xGlobalPrice} ${row?.poolName?.split('-')[0]}`,
    right: true,
  },
  {
    name: 'Global Price',
    selector: 'yGlobalPrice',
    minWidth: "150px",
    format: row => `$${row.yGlobalPrice} ${row?.poolName?.split('-')[1]}`,
    right: true,
  },
  {
    name: 'Global Ratio',
    selector: 'globalRatio',
    right: true,
    minWidth: "200px"
  },
  {
    name: 'Internal Ratio',
    selector: 'internalRatio',
    minWidth: "200px",
    right: true,
  },
  {
    name: 'Arbitrage Chance',
    selector: 'discrepancyRate',
    format: (row) => {
      const pairA = row?.poolName?.split('-')[0].toLowerCase()
      const pairB = row?.poolName?.split('-')[1].toLowerCase()

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

      return <span style={{ color: color, fontWeight: isBold ? '600' : '400' }}>
        {row.discrepancyRate + '%'}
        <button onClick={() => {
          row.history.push(`/swap?from=${pairA}&to=${pairB}`)
        }} className="tradingButton">Chance</button>
      </span>

    },
    sortable: true,
    right: true,
  },
];

//Styled-components
const Wrapper = styled.div`
width: 100%;

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
`




function Table() {
  const [tableData, setTableData] = React.useState([{ id: 1, title: 'Conan the Barbarian', year: '1982' }])
  const history = useHistory();
  // eslint-disable-next-line
  React.useEffect(async () => {

    getPriceData()
    setInterval(async () => {
      getPriceData()
    }, 10000)

    async function getPriceData() {
      let priceData = [];
      const response = await axios.get("http://gravity-rpc-603263776.ap-northeast-1.elb.amazonaws.com:8080/pools")
      response.data.pools.forEach((pool, index) => {
        const xCoinName = `${pool.reserveCoins[0].denom.substr(1).toUpperCase()}`
        const yCoinName = `${pool.reserveCoins[1].denom.substr(1).toUpperCase()}`
        const poolName = `${xCoinName}-${yCoinName}`

        const xGlobalPrice = Number(cutNumber(pool.reserveCoins[0].globalPrice * 1000000, 4))
        const yGlobalPrice = Number(cutNumber(pool.reserveCoins[1].globalPrice * 1000000, 4))

        const globalRatio = pool.reserveCoins[0].globalPrice / pool.reserveCoins[1].globalPrice
        const internalRatio = pool.reserveCoins[1].amount / pool.reserveCoins[0].amount

        const discrepancyRate = (internalRatio / globalRatio) - 1 > 0 ? (internalRatio / globalRatio) - 1 : ((internalRatio / globalRatio) - 1) * -1

        if (!isNaN(internalRatio)) {
          priceData.push({
            id: index,
            poolName: poolName,
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
  }, [])

  return (
    <Wrapper>
      {tableData !== null ? <DataTable
        title="Pool Price"
        className="table"
        defaultSortField="discrepancyRate"
        defaultSortAsc={false}
        columns={columns}
        data={tableData}
        fixedHeader={true}
      /> : <div>No data</div>}
    </Wrapper>
  )
}

export default Table