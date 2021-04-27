 // @ts-nocheck
import * as React from 'react'
import styled from "styled-components"
import { useSelector } from "react-redux";
import {cutNumber} from "../../utils/global-functions"
import { cosmosSelector } from "../../modules/cosmosRest/slice"

import DataTable from 'react-data-table-component';
import axios from 'axios';

const columns = [
  {
    name: 'Rank',
    selector: 'rank',
    sortable: true,
    center: true,
    minWidth: "40px",
    maxWidth: "60px"
  },
  {
    name: 'Account',
    selector: 'accountAddress',
    // sortable: true,
    minWidth: "160px",
    maxWidth: "200px"
  },
  {
    name: 'Action Score',
    selector: 'actionScore',
    sortable: true,
    minWidth: "160px",
    maxWidth: "200px"
  },
  {
    name: 'Trading Score',
    selector: 'tradingScore',
    sortable: true,
    minWidth: "160px",
    maxWidth: "200px"
  },
  {
    name: 'Total Score',
    selector: 'totalScore',
    sortable: true,
    minWidth: "160px",
    maxWidth: "200px"
  },
];

//Styled-components
const Wrapper = styled.div`
width: 100%;
    .table {
      width: 100%;
    }
`

const Title = styled.div`
  text-align: center;
  width: 100%;
`

function Table() {
  const [tableData, setTableData] = React.useState([])
  const { userAddress } = useSelector(cosmosSelector.all);
  // console.log(userAddress)
    // eslint-disable-next-line
    React.useEffect(async () => {
        let rankData = [];
        const response = await axios.get(`http://gravity-rpc-603263776.ap-northeast-1.elb.amazonaws.com:8080/scoreboard?address=${userAddress}`)
        response.data.accounts.forEach((account,index) => {
          const accountAddress = `${account.address.substr(0, 10)}...${account.address.substr(-5)}`
          const rank = account.ranking
          const actionScore = cutNumber(account.actionScore, 2)
          const tradingScore = cutNumber(account.tradingScore, 2)
          const totalScore = cutNumber(account.totalScore, 2)
          rankData.push({
            accountAddress: accountAddress,
            rank: rank,
            actionScore: actionScore,
            tradingScore: tradingScore,
            totalScore: totalScore
          })
        })
        if(response.data.me) {
          rankData.unshift({...response.data.me, 
            accountAddress: "YOU", 
            rank:response.data.me.ranking,
            actionScore: cutNumber(response.data.me.actionScore, 2),
            tradingScore: cutNumber(response.data.me.tradingScore, 2),
            totalScore: cutNumber(response.data.me.totalScore, 2 )
          })
        }
        
        setTableData(rankData)
        
        console.log(response.data)
    },[userAddress])
   

    return (
      <Wrapper>
        {tableData !== null ? <DataTable  
        title={"Ranking"}
        columns={columns}
        data={tableData}
        fixedHeader={true}
        subHeaderAlign={"center"}
        /> : <div>No data</div>}
        
      </Wrapper>
    )
}

export default Table