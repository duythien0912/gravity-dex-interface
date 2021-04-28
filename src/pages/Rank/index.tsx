// @ts-nocheck
import * as React from 'react'
import styled from "styled-components"
import { useSelector } from "react-redux";
import { cutNumber } from "../../utils/global-functions"
import { cosmosSelector } from "../../modules/cosmosRest/slice"

import DataTable from 'react-data-table-component';
import axios from 'axios';

const columns = [
  {
    name: 'Rank',
    selector: 'rank',
    center: true,
    format: (row) => {
      if (row.accountAddress !== "YOU") {
        return <span className="rank">{row.rank}</span>
      } else {
        return <span className="myRank">{row.rank}</span>
      }
    }
    ,
    minWidth: "40px",
    maxWidth: "60px"
  },
  {
    name: 'Account',
    selector: 'accountAddress',
    right: true,
    // sortable: true,
    format: (row) => {
      if (row.accountAddress !== "YOU") {
        return row.accountAddress
      } else {
        return <span className="myRank">{row.accountAddress}</span>
      }
    },
    minWidth: "160px",
    maxWidth: "200px"
  },
  {
    name: 'Action Score',
    selector: 'actionScore',
    sortable: true,
    right: true,
    minWidth: "160px",
    maxWidth: "200px"
  },
  {
    name: 'Trading Score',
    selector: 'tradingScore',
    sortable: true,
    right: true,
    minWidth: "160px",
    maxWidth: "200px"
  },
  {
    name: 'Total Score',
    selector: 'totalScore',
    sortable: true,
    right: true,
    format: (row) => {
      return <span className="score">{row.totalScore}</span>
    },
    minWidth: "160px",
    maxWidth: "200px"
  },
];

//Styled-components
const Wrapper = styled.div`
max-width: 800px;
margin: 0 auto;
padding: 0 30px 10px 30px;

@media(max-width: 500px) {
  width: 100%;
}

/* border-radius: 20px; */
.table {
  margin-bottom: 0 !important;
  padding-bottom: 0 !important;
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

.rank {
  font-weight: bold;
  font-size: 16px;
}

.myRank {
  font-size: 18px;
  color:#F6743C;
  font-weight: bold;
}

.score {
  font-weight: bold;
  font-size: 16px;
}

#column-rank {
  
}
`


function Table() {
  const [tableData, setTableData] = React.useState([])
  const { userAddress } = useSelector(cosmosSelector.all);
  // console.log(userAddress)
  // eslint-disable-next-line
  React.useEffect(async () => {
    let rankData = [];
    const response = await axios.get(`http://gravity-rpc-603263776.ap-northeast-1.elb.amazonaws.com:8080/scoreboard?address=${userAddress}`)
    response.data.accounts.forEach((account, index) => {
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
    if (response.data.me) {
      rankData.unshift({
        ...response.data.me,
        accountAddress: "YOU",
        rank: response.data.me.ranking,
        actionScore: cutNumber(response.data.me.actionScore, 2),
        tradingScore: cutNumber(response.data.me.tradingScore, 2),
        totalScore: cutNumber(response.data.me.totalScore, 2)
      })
    }

    setTableData(rankData)

    console.log(response.data)
  }, [userAddress])


  return (
    <Wrapper>
      {tableData !== null ? <DataTable
        title={"Ranking"}
        overflowY={true}
        columns={columns}
        className="table"
        data={tableData}
        responsive={true}
        fixedHeader={true}
        subHeaderAlign={"center"}
      /> : <div>No data</div>}

    </Wrapper>
  )
}

export default Table