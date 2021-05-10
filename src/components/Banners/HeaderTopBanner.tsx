import * as React from 'react';
import styled from "styled-components";
import { useHistory } from 'react-router-dom'
import Countdown from 'react-countdown'
import { mobileCheck } from '../../utils/global-functions';

const Wrapper = styled.div`
  width: 300px;
  text-align: right;
  /* height: 100%; */
  overflow: hidden;
  position: fixed;
  right: 0;
  top: 80px;
  color: #fff;

  .timer {
    font-size: 14px;
    border-left: 1px solid #fff;
    margin-left: 10px;
    padding-left: 10px;
  }

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
       
      }

      .banner-content {
        text-decoration: none;
        /* display: flex; */
        flex-wrap: wrap;
        color: #fff !important;
        width: 100%;
        font-size: 14px;
       
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
flex-direction: row;
align-items: flex-start;
padding: 4px 8px 4px 8px;
margin: 8px 0;
position: relative;
right: 0;
width: 182px;
height: 42px;
font-size: 24px;
align-items: center;
/* top: 29px; */

/* Whites/~200 */

background: rgba(255, 255, 255, 0.2);
border-radius: 4px;
div {
    display:inline-block;
    min-width: fit-content;
    text-align: left;
    font-size: 24px;
    /* padding-right: 8px; */
    margin:0 4px;
}
`
// Renderer callback with condition
const renderer = ({ days, hours, minutes, seconds, completed }) => {
  if (completed) {
    // Render a completed state
    return <TimeLeft><div style={{ margin: "0 auto" }}>THE END</div></TimeLeft>;
  } else {
    // Render a countdown
    return <TimeLeft><div>00</div> : <div>0{hours + days * 24} </div> : <div> {minutes} </div> : <div style={{ minWidth: "45px" }}>{seconds}</div> </TimeLeft>
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
  const [remainingTime, setRemainingTime] = React.useState(null)

  React.useEffect(() => {
    async function getBannerData() {
      try {
        // const response = await axios.get(`${chainInfo.competitionInfoBaseUrl}/banner`)
        // const response = {
        //   data: {
        //     banner: {
        //       endsAt: "2021-05-03T23:36:00Z",
        //       startsAt: "2021-05-05T23:35:25Z",
        //       state: "Upcomings",
        //       text: "Attention!!! Price distortion and trading volume hike will happen in random pools soon. Search pools and take the opportunity!",
        //       url: "/price"
        //     }
        //   }
        // }
        const UTCNow = new Date().getTime()
        const startRemainingTime = new Date("2021-05-11T00:00:00Z").getTime() - UTCNow
        const endRemainingTime = new Date("2021-05-11T00:00:00Z").getTime() - UTCNow

        if (startRemainingTime > 0) {
          setRemainingTime(startRemainingTime)
          setIsClose(false)
        } else if (endRemainingTime > 0) {
          setRemainingTime(endRemainingTime)
          setIsClose(false)
        } else {
          setRemainingTime(0)
          setIsClose(true)
        }

      } catch {
        setIsClose(true)
      }
    }

    getBannerData()
    setInterval(() => {
      getBannerData()
    }, 300000)
  }, [])

  const counter = React.useMemo(() => {
    if (remainingTime > 0 && !mobileCheck()) {
      return (
        <>

          <Countdown
            date={Date.now() + remainingTime}
            renderer={renderer}
          />

        </>)
    } else {
      return ''
    }

  }, [remainingTime])


  return (
    <Wrapper style={{ display: isClose ? 'none' : 'unset' }}>
      <div className="banner">
        <div className="banner-content">
          <div style={{ fontSize: "16px" }}>COMPETITION ENDS SOON</div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div></div>
            {counter}
          </div>
          <div>MAY 11, 00:00 UTC</div>
        </div>
      </div>
    </Wrapper>
  );
}

export default HeaderTopBanner