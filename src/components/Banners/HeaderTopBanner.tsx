import * as React from 'react';
import styled from "styled-components";

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

    a {
        color: #fff !important;
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

function HeaderTopBanner() {
    const [isClose, setIsClose] = React.useState(false)
    return (
        <Wrapper style={{ display: isClose ? 'none' : 'unset' }}>
            <div className="background">
                <div className="bg"></div>
                <div className="bg bg2"></div>
                <div className="bg bg3"></div>
            </div>
            <div className="banner">
                <div className="banner-content">Soon™️, There will be Sudden Price Change 📈  and APY Boosting 🚀  (More info at <a href="https://gravitydex.io" target="_blank" rel="noopener noreferrer">Here</a>)</div>
                <div onClick={() => {
                    setIsClose(true)
                }} className="banner-close">X</div>
            </div>
        </Wrapper>
    );
}

export default HeaderTopBanner