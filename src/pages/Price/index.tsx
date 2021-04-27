 // @ts-nocheck
import * as React from 'react'
import styled from "styled-components"
import { useSelector } from "react-redux";
import {cutNumber} from "../../utils/global-functions"

import DataTable from 'react-data-table-component';
import axios from 'axios';

let data = [{ id: 1, title: 'Conan the Barbarian', year: '1982' }];
const columns = [
  {
    name: 'Pool',
    selector: 'poolName',
    sortable: true,
  },
  {
    name: 'Global Price',
    selector: 'xGlobalPrice',
    sortable: true,
    right: true,
  },
  {
    name: 'Global Price',
    selector: 'yGlobalPrice',
    sortable: true,
    right: true,
  },
  {
    name: 'Global Ratio',
    selector: 'globalRatio',
    sortable: true,
    right: true,
  },
  {
    name: 'Internal Ratio',
    selector: 'internalRatio',
    sortable: true,
    right: true,
  },
  {
    name: 'Discrepancy Rate',
    selector: 'discrepancyRate',
    sortable: true,
    right: true,
  },
];

//Styled-components
const Wrapper = styled.div`
width: 100%;
    .table {
      width: 100%;
    }
`




function Table() {
  const [tableData, setTableData] = React.useState([{ id: 1, title: 'Conan the Barbarian', year: '1982' }])
    
    // eslint-disable-next-line
    React.useEffect(async () => {
        let priceData = [];
        const response = await axios.get("http://gravity-rpc-603263776.ap-northeast-1.elb.amazonaws.com:8080/pricetable")
        response.data.pools.forEach((pool,index) => {
          console.log(pool)
          const xCoinName = `${pool.reserveCoins[0].denom.substr(1).toUpperCase()}`
          const yCoinName = `${pool.reserveCoins[1].denom.substr(1).toUpperCase()}`
          const poolName = `${xCoinName}-${yCoinName}`

          const xGlobalPrice = `$${cutNumber(pool.reserveCoins[0].globalPrice * 1000000, 4)} ${xCoinName}`
          const yGlobalPrice =  `$${cutNumber(pool.reserveCoins[1].globalPrice * 1000000, 4)} ${yCoinName}`
          
          const globalRatio = pool.reserveCoins[0].globalPrice / pool.reserveCoins[1].globalPrice
          const internalRatio = pool.reserveCoins[1].amount / pool.reserveCoins[0].amount

          const discrepancyRate = (internalRatio / globalRatio) - 1

          if(!isNaN(internalRatio)) {
            priceData.push({
              id:index, 
              poolName: poolName, 
              xGlobalPrice: xGlobalPrice, 
              yGlobalPrice:yGlobalPrice, 
              globalRatio: `${cutNumber(globalRatio, 4)} ${yCoinName} per ${xCoinName}`,
              internalRatio: `${cutNumber(internalRatio, 4)} ${yCoinName} per ${xCoinName}`,
              discrepancyRate: Number(`${cutNumber(discrepancyRate * 100, 2)}`)
              })
            }
          console.log(poolName)
        })

        setTableData(priceData)
        
        console.log(response.data)
    },[])
   

    return (
      <Wrapper>
        {tableData !== null ? <DataTable  
        title="Pool Price"
        columns={columns}
        data={tableData}
        /> : <div>No data</div>}
        
      </Wrapper>
    )
}

export default Table