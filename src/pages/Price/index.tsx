import * as React from 'react'
import styled from "styled-components"
import { useSelector } from "react-redux";


//Styled-components
const Wrapper = styled.div`
    
`




function SwapCard() {
    React.useEffect(() => {
        //미로그인시 connectWallet 스테이터스 아니면 empty로
    }, [])
   

    return (
      <Wrapper>
          <div>test</div>
      </Wrapper>
    )
}

export default SwapCard