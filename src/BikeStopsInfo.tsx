import { CSSProperties, useState, useEffect, ReactNode} from "react"
import searchIcon from './images/SearchIcon.svg';
import twoWomenBiking from "./images/twoWomenBiking.svg";
import CheckBox from '@mui/material/Checkbox';
import createTheme from "@mui/material/styles/createTheme";
import { ThemeProvider } from "@emotion/react";
import useUbikeStopsDataSet from './useUbikeStopsDataSet';
import UbikeStop from "./UbikeStop";
import { useRWD, Device } from "./useRWD";

function BikeStopsInfo(): JSX.Element {
  let device = useRWD();
  let style: CSSProperties = {
      marginLeft: device == 'PC'? 124: 32
  }
  let headingStyle: CSSProperties = {
      fontFamily: "Noto Sans CJK TC",
      fontSize: 24,
      fontWeight: 700,
      letterSpacing: "0.18em",
      textAlign: "left",
      color: "#B5CC22"
  };
  let checkboxesStyle: CSSProperties = {
    width: device == 'PC'? "40%" : 320,
    display: "inline-block",
    fontFamily: "Noto Sans CJK TC",
    fontSize: device == 'PC'? 18 : 16,
    fontWeight: 400,
    letterSpacing: "0em",
    textAlign: "left",
    marginTop: device == 'PC'? 20: 0,
  };
  let tableStyle: CSSProperties = {
    width: device == 'PC'? undefined: '90%',
    overflowX: 'scroll'
  }
  switch (device) {
    case 'PC':
      break;
    case 'mobile':
      break;
  }


  let [searchTerm, setSearchTerm] = useState("");
  let [[region, districtsIsSelected], setRegionAndSelectedDistricts]
    = useState<[string, {[district: string]: boolean}]>(['', {}]);
  let ubikeStops: UbikeStop[] = useUbikeStopsDataSet();
  let searchBar: JSX.Element =
    <SearchBar
      value={searchTerm}
      onChange={setSearchTerm}
    />

  return (
    <div style={style}>
      <h2 style={headingStyle}>站點資訊</h2>
      {device == 'mobile' && <div style={{paddingBottom: 8}}>{searchBar}</div>}
      <RegionSelect
        region={region}
        setRegion={region => {
          let newDistrictsIsSelected: {[district: string]: boolean} = {};
          let districts = getDistricts(region);
          districts.forEach(district => { newDistrictsIsSelected[district] = true; })
          setRegionAndSelectedDistricts([
            region,
            newDistrictsIsSelected
          ]);
        }}
        filterText={searchTerm}/>
      {device == 'PC' && searchBar}
      {region != '' && <div style={{minWidth: 700, overflowX: 'auto'}}>
        <div style={checkboxesStyle}>
          <LabelledCheckbox
            checked={Object.values(districtsIsSelected).every(b => b)}
            onCheck={checkOrUncheckAll}
            label="全部勾選"
          />
          <br/>
          {Object.keys(districtsIsSelected).map(district => (
              <span key={district}>
                <LabelledCheckbox
                  checked={districtsIsSelected[district]}
                  onCheck={() => {
                    let newDistrictsIsSelected = {...districtsIsSelected};
                    newDistrictsIsSelected[district] = !districtsIsSelected[district];
                    setRegionAndSelectedDistricts([region, newDistrictsIsSelected]);
                  }}
                  label={district}
                />
              </span>
          ))}
        </div>
        {device == 'PC' && <img src={twoWomenBiking} style={{position: "relative", bottom: -30, marginLeft: 100}}></img> }
      </div>}
      <div style={tableStyle}>
        <UbikeStopTable data={ubikeStops.filter(shouldShowInTable)}/>
      </div>
    </div>
  );
  function shouldShowInTable(ubikeStop: UbikeStop): boolean {
    return ubikeStop.city == region && districtsIsSelected[ubikeStop.district];
  }
  function checkOrUncheckAll(shouldCheck: boolean): void {
    let newDistrictsIsSelected = {...districtsIsSelected};
    Object.keys(newDistrictsIsSelected).forEach(district => {
      newDistrictsIsSelected[district] = shouldCheck;
    })
    setRegionAndSelectedDistricts([region, newDistrictsIsSelected]);
  }
  function LabelledCheckbox(props: {
    label: string;
    checked: boolean;
    onCheck(checked: boolean): void
  }): JSX.Element {

    const style: CSSProperties = {
      margin: "10px 10px 10px 0px",
      display: "inline-block",
      fontSize: device == 'PC'? 18: 16,
    }
    const theme = createTheme({
      palette: {
        primary: {
          main: "#B5CC22"
        }
      }
    });
    return (
      <ThemeProvider theme={theme}>
        <div style={style}>
          <CheckBox
              checked={props.checked}
              onChange={(event) => { props.onCheck(event.target.checked); }}
              />
            {props.label}
        </div>
      </ThemeProvider>
    )

  }
}

function UbikeStopTable(props: {data: UbikeStop[]}): JSX.Element {
  let device = useRWD();
  if (props.data.length == 0) return <></>;
  let style: CSSProperties = {
    borderCollapse: "collapse",
    margin: "25px 0",
    fontSize: device == 'PC'? 18: 16,
    width: "90%",
    minWidth: 700,
    textAlign: "center",
    font: "Noto Sans CJK TC"
  }
  return (
    <table style={style}>
      <tr style={{backgroundColor: "#B5CC22"}}>
        <Th isFirst>縣市</Th>
        <Th>區域</Th>
        <Th>站點名稱</Th>
        <Th>可借車輛</Th>
        <Th isLast>可還空位</Th>
      </tr>
      {props.data.map((ubikeStop, index) => <Tr isOdd={index % 2 == 1} ubikeStop={ubikeStop}></Tr>)}
    </table>
  );
  function Th(props: {children: string, isFirst?: boolean, isLast?: boolean}): JSX.Element {
    let style: CSSProperties = {
      backgroundColor: "#B5CC22",
      color: "white",
      borderRadius: `${props.isFirst? 28: 0}px ${props.isLast? 28: 0}px 0px 0px`,
      paddingTop: 21,
      paddingBottom: 21,
      width: 0
    };
    return (
      <th style={style}>
        {props.children}
      </th>
    )
  }
  function Tr(props: {ubikeStop: UbikeStop, isOdd?: boolean, isFirst?: boolean, isLast?: boolean}): JSX.Element {
    let style: CSSProperties = {
      backgroundColor: (props.isOdd)? "#F6F6F6": "#ffffff",
      borderWidth: 0,
      borderCollapse: "collapse",
      borderRadius: `${props.isFirst? 28: 0}px ${props.isLast? 28: 0}px 0px 0px`,
    }
    return (
      <tr style={style} key={props.ubikeStop.id}>
        <Td>{props.ubikeStop.city}</Td>
        <Td>{props.ubikeStop.district}</Td>
        <Td>{props.ubikeStop.name}</Td>
        <Td bold>{props.ubikeStop.availableBikes}</Td>
        <Td bold>{props.ubikeStop.availableParkingLots}</Td>
      </tr>
    )
    function Td(props: {children: ReactNode; bold?: boolean}): JSX.Element {
      let style: CSSProperties = {
        paddingTop: 21,
        paddingBottom: 21,
        fontWeight: props.bold? 700: "normal",
        color: props.bold? "#B5CC22": "#323232"
      }
      return <td style={style}>{props.children}</td>
    }
  }
}

function SearchBar(props: {value: string; onChange(value: string): void}): JSX.Element {
  let device = useRWD();
  let style: CSSProperties = {
    width: 277,
    padding: "8px 16px 8px 16px",
    borderRadius: 8,
    border: "none",
    outline: "none",
    marginLeft: device == 'PC'? 16: 0,
    backgroundColor: "#F6F6F6",
    fontFamily: "Noto Sans CJK TC",
    fontSize: device == 'PC'? 18: 16,
    fontWeight: 500,
    letterSpacing: 0.10000000149011612,
  };
  let iconStyle: CSSProperties = {
    position: "relative",
    left: -25,
    top: 3
  };
  let [isHovered, setIsHovered] = useState(false);
  let clearButtonStyle: CSSProperties = {
    position: "relative",
    left: -70,
    border: "none",
    backgroundColor: isHovered? "#dddddd" : "transparent",
    color: "#aaaaaa",
    cursor: "pointer",
    borderRadius: "40%",
  }
  return (
    <span style={{whiteSpace: 'nowrap'}}>
      <input
        style={style}
        placeholder="搜尋站點"
        value={props.value}
        onChange={(event) => props.onChange(event.target.value)}
        >
      </input>
      <img src={searchIcon} style={iconStyle}></img>
      <button
        style={clearButtonStyle}
        onClick={() => props.onChange("")}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >x</button>
    </span>
  )
}

function RegionSelect(props: {
  filterText: string;
  region: string,
  setRegion(region: string): void
}): JSX.Element {
  let device = useRWD();
  const regionList = getRegionList();
  let style: CSSProperties = {
    width: device == 'PC'? 175: 308,
    height: 40,
    left: 124,
    padding: "8px 16px 8px 16px",
    borderRadius: 8,
    border: "none",
    outline: "none",
    backgroundColor: "#F6F6F6",
    fontSize: device == 'PC'? 18: 16
  }
  return (
    <select
      value={props.region}
      onChange={event => props.setRegion(event.target.value)}
      style={style}
    >
      <option disabled={true} value="" style={{color: "#AEAEAE"}}>
        選擇縣市
      </option>
      {regionList
        .filter((region) => props.filterText == "" || region.includes(props.filterText))
        .map(((region, index) => <option key={index} value={region}>{region}</option>))
      }
    </select>
  )
}

function getRegionList(): string[] {
  return [
    "台北市",
    "新北市",
    "桃園市",
    "台中市",
    "台南市",
    "高雄市",
    "新竹縣",
    "苗栗縣",
    "彰化縣",
    "南投縣",
    "雲林縣",
    "嘉義縣",
    "屏東縣",
    "宜蘭縣",
    "花蓮縣",
    "台東縣",
    "澎湖縣",
    "金門縣",
    "連江縣",
    "基隆市",
    "新竹市",
    "嘉義市",
  ]
}

function getDistricts(region: string): string[] {
  switch (region) {
    case "台北市":
      return [
        "松山區",
        "信義區",
        "大安區",
        "中山區",
        "中正區",
        "大同區",
        "萬華區",
        "文山區",
        "南港區",
        "內湖區",
        "士林區",
        "北投區"
      ];
    default:
      return []
  }
}

export default BikeStopsInfo;