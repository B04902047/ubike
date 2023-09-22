
import { CSSProperties, useState } from 'react';
import logo from '../images/logo.svg';
import { Outlet, Link } from 'react-router-dom';

function Header(): JSX.Element {
  let style: CSSProperties = {
    width: "100%",
    minWidth: 700,
    height: 104,
    borderBottom: "1px solid #EBEBEB"
  }
  let logoStyle: CSSProperties = {
    width: 95,
    height: 95,
    paddingTop: 6,
    paddingLeft: 124,
    display: "inline"
  };
  let linksStyle: CSSProperties = {
    position: "absolute",
    top: 40,
    left: 279,
    display: "inline",
    minWidth: 1000
  };
  let linkStyle: CSSProperties = {
    paddingLeft: 40,
    color: "#677510",
    fontFamily: "Noto Sans CJK TC",
    fontSize: 18,
    fontWeight: 500,
    letterSpacing: "0em",
    textAlign: "left",
    textDecoration: 'none'
  };
  return (
    <div>
      <div style={style}>
        <img style={logoStyle} src={logo} alt="logo"/>
        <div style={linksStyle}>
          <Link to="/manual" style={linkStyle}>使用說明</Link>
          <Link to="/charging" style={linkStyle}>收費方式</Link>
          <Link to="/bikeStopsInfo" style={{...linkStyle, color: "#B5CC22"}}>站點資訊</Link>
          <Link to="/news" style={linkStyle}>最新消息</Link>
          <Link to="/events" style={linkStyle}>活動專區</Link>
        </div>
        <LoginButton/>
      </div>
      <Outlet/>
    </div>
  )
}

function LoginButton(): JSX.Element {
  let [isHovered, setIsHovered] = useState(false);
  let style: CSSProperties = {
    width: 85,
    height: 40,
    cursor: "pointer",
    position: "absolute",
    top: 32,
    left: "85%",
    borderRadius: 100,
    background: isHovered? "#B5CC22" : "#c0d630",
    border: "none",
    color: "white",
    fontFamily: "Noto Sans CJK TC",
    fontSize: 18,
    fontWeight: 400,
    letterSpacing: 0.10000000149011612,
    textAlign: "center"
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