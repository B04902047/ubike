
import { CSSProperties, ReactNode, useEffect } from 'react';
import logo from '../images/logo.svg';
import optionIcon from './OptionIcon.svg'
import crossIcon from './CrossIcon.svg'
import { Outlet, Link } from "react-router-dom";
import { useState } from 'react';


function Header(): JSX.Element {
  let style: CSSProperties = {
    height: 72,
    paddingLeft: 32,
    paddingTop: 7,
    borderBottom: "1px solid #EBEBEB"
  };
  let tabsStyle: CSSProperties = {
    position: 'fixed',
    left: 0,
    top: 73,
    width: '100%',
    zIndex: 1,
    backgroundColor: "#B5CC22",
    paddingTop: 10,
    paddingBottom: 30,
  };
  let [showTabs, setShowTabs] = useState(false);
  useEffect(() => {
    if (showTabs) document.body.style.overflow = "hidden";
    else document.body.style.overflow = 'auto';
  }, [showTabs])
  return (
    <div>
      <div style={style}>
        <img width={65} height={65} src={logo}/>
        <img
          width={24}
          height={24}
          style={{position: "absolute", right: 22, top: 24, cursor: "pointer"}}
          src={showTabs? crossIcon: optionIcon}
          onClick={() => setShowTabs(!showTabs)}
        />
      </div>
      {showTabs && (
        <div style={tabsStyle}>
          <StyledLink to="/manual" >使用說明</StyledLink>
          <StyledLink to="/charging">收費方式</StyledLink>
          <StyledLink to="/bikeStopsInfo" isClicked>站點資訊</StyledLink>
          <StyledLink to="/news">最新消息</StyledLink>
          <StyledLink to="/events">活動專區</StyledLink>
          <LoginButton/>
          <div style={{backgroundColor: 'white', width: '100%', height: 200}}></div>
        </div>
      )}
      <Outlet/>
    </div>
  )

  function StyledLink(props: {to: string, children: string, isClicked?: boolean}): JSX.Element {
  
    let style: CSSProperties = {
      padding: "18px 0px"
    }
    let linkStyle: CSSProperties = {
      paddingLeft: 40,
      color: props.isClicked? "#677510": "white",
      fontFamily: "Noto Sans CJK TC",
      fontSize: 18,
      fontWeight: 500,
      letterSpacing: "0em",
      textAlign: "left",
      textDecoration: 'none'
    };
    return <div style={style} onClick={() => setShowTabs(false)}>
      <Link to={props.to} style={linkStyle}>{props.children}</Link>
    </div>
  }
}

function LoginButton(): JSX.Element {
  let [isHovered, setIsHovered] = useState(false);
  let style: CSSProperties = {
    width: 85,
    height: 40,
    cursor: "pointer",
    borderRadius: 100,
    background: "white",
    border: "none",
    color: isHovered? "#677510" : "#b5cc22",
    fontFamily: "Noto Sans CJK TC",
    fontSize: 18,
    fontWeight: 400,
    letterSpacing: 0.10000000149011612,
    textAlign: "center",
    marginTop: 250,
    marginLeft: 32,
    marginBottom: 20
  }
  return (
    <button
      style={style}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      >
      登入
    </button>
  )
}


export default Header;