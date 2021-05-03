import * as React from 'react';
import styled from "styled-components";
import { useHistory } from 'react-router-dom'
import {chainInfo} from "../../cosmos-amm/config"
import Countdown from 'react-countdown'
import axios from "axios"

const Wrapper = styled.div`
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: relative;
    color: #fff;
.banner {
    position:relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
    top: 0;
    left: 0;
    /* height: 28px; */
    width: 100%;
    padding: 4px 20px;

    .banner-close {
        font-size: 20px;
        cursor: pointer;
    }

    .banner-content {
      text-decoration: none;
      color: #fff !important;
      width: 100%;
      cursor:pointer;
    }
}

.background {
    position: absolute;
    width: 100%;
    height: 80px;
    top: 0;
    left: 0;
}
  
.bg {
  animation:slide 3s ease-in-out infinite alternate;
  background-image: linear-gradient(-60deg,#cb4df5 50%,#e26b5d 50%);
  bottom:0;
  height: 80px;
  left:-50%;
  opacity:.5;
  position:absolute;
  right:-50%;
  top:0;
  z-index:-1;
}

.bg2 {
  animation-direction:alternate-reverse;
  animation-duration:8s;
}

.bg3 {
  animation-duration:10s;
}

.content {
  background-color:rgba(255,255,255,.8);
  border-radius:.25em;
  box-shadow:0 0 .25em rgba(0,0,0,.25);
  box-sizing:border-box;
  left:50%;
  padding:10vmin;
  position:fixed;
  text-align:center;
  top:50%;
  transform:translate(-50%, -50%);
}

@keyframes slide {
  0% {
    transform:translateX(-25%);
  }
  100% {
    transform:translateX(25%);
  }
}
`

const TimeLeft = styled.div`
display: flex;
width: 240px;
margin: 10px auto 0 auto;
justify-content: space-around;

div {
    min-width: 80px;
    text-align: center;
    font-size: 18px;
}
`
// Renderer callback with condition
const renderer = ({ hours, minutes, seconds, completed }) => {
    if (completed) {
        // Render a completed state
        return <div>The time is up 😂</div>;
    } else {
        // Render a countdown
        return <TimeLeft><div>{hours} hour</div><div> {minutes} min</div> <div>{seconds} sec</div></TimeLeft>;
    }
};
//test data
// endsAt: "2021-05-03T12:25:00Z"
// startsAt: "2021-05-03T12:10:00Z"
// state: "started"
// text: "You must verify your session through reCAPTCHA!"
// url: "https://google.com"


function HeaderTopBanner() {
    const [isClose, setIsClose] = React.useState(true)
    const [bannerData, setBannerData] = React.useState(null)
    const [remainingTime, setRemainingTime] = React.useState(null)
    const history = useHistory()
    

    React.useEffect( () => {
      async function getBannerData() {
        try {
          const response = await axios.get(`${chainInfo.competitionInfoBaseUrl}/banner`)
          if(response.data.banner === null) {
            setIsClose(true)
          } else {
            setBannerData(response.data.banner)
            console.log(response.data.banner)
            const UTCNow= new Date().getTime()
            const upComingEvent = new Date(response.data.banner.startsAt).getTime()
            const remainingTime = upComingEvent - UTCNow
            
            if(remainingTime > 0) {
              setRemainingTime(remainingTime)
            }

            setIsClose(false)
          }
        } catch {
          setIsClose(true)
        }
      }

      getBannerData()
      setInterval(() => {
        getBannerData()
        
      }, 10000)
     
    },[])
    const counter = remainingTime > 0 ?  <Countdown
    date={Date.now() + remainingTime}
    renderer={renderer}
/> : ''

    return (
        <Wrapper style={{ display: isClose ? 'none' : 'unset' }}>
            <div className="background">
                <div className="bg"></div>
                <div className="bg bg2"></div>
                <div className="bg bg3"></div>
            </div>
            <div className="banner">
                {bannerData?.url?.startsWith('http') ? <a className="banner-content" href={bannerData?.url} target="_blank" rel="noopener noreferrer">{bannerData?.text}
                </a> : <div className="banner-content" onClick={() => {
                  history.push(bannerData?.url)
                }}>{bannerData?.text}</div>}

                <div onClick={() => {
                    setIsClose(true)
                }} className="banner-close">X</div>
            </div>
        </Wrapper>
    );
}

export default HeaderTopBanner