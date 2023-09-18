import { CSSProperties, useState, useEffect, ReactNode} from "react"
import searchIcon from './SearchIcon.svg';
import axios, { AxiosResponse } from 'axios';
import twoWomenBiking from "./twoWomenBiking.svg";
import CheckBox from '@mui/material/Checkbox';
import createTheme from "@mui/material/styles/createTheme";
import { ThemeProvider } from "@emotion/react";

interface UbikeStop {
  id: string;
  city: string;
  name: string;
  district: string;
  availableBikes: number;
  availableParkingLots: number;
}

function useUbikeStopDataSet() {
  let [ubikeStops, setUbikeStops] = useState<UbikeStop[]>([]);
  useEffect(() => {
    axios.get("https://tcgbusfs.blob.core.windows.net/dotapp/youbike/v2/youbike_immediate.json")
      .then((response: AxiosResponse<any[], any>) => {
        let data: UbikeStop[] = response.data.map(stop => {
          return {
            id: stop.sno,
            city: "台北市",
            name: stop.sna,
            district: stop.sarea,
            availableBikes: stop.sbi,
            availableParkingLots: stop.bemp
          };
        });
        setUbikeStops(data);
      })
  }, []);
  return ubikeStops;
}


function BikeStopsInfo(): JSX.Element {
  const style: CSSProperties = {
      marginLeft: 124
  }
  const headingStyle: CSSProperties = {
      fontFamily: "Noto Sans CJK TC",
      fontSize: 24,
      fontWeight: 700,
      letterSpacing: "0.18em",
      textAlign: "left",
      color: "#B5CC22"
  };
  const checkboxesStyle: CSSProperties = {
    minWidth: 500,
    width: "40%",
    display: "inline-block",
    fontFamily: "Noto Sans CJK TC",
    fontSize: 18,
    fontWeight: 400,
    letterSpacing: "0em",
    textAlign: "left",
    marginRight: 70,
    marginTop: 20
  };


  let [searchTerm, setSearchTerm] = useState("");
  let [[region, districtsIsSelected], setRegionAndSelectedDistricts]
    = useState<[string, {[district: string]: boolean}]>(['', {}]);
  let ubikeStops: UbikeStop[] = useUbikeStopDataSet();

  return (
    <div style={style}>
      <h2 style={headingStyle}>站點資訊</h2>
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
        filterText={searchTerm}></RegionSelect>
      <SearchBar
        value={searchTerm}
        onChange={setSearchTerm}
      />
      {region != '' && <div>
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
        <img src={twoWomenBiking}></img>
      </div>}
      <UbikeStopTable data={ubikeStops.filter(shouldShowInTable)}/>
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
      margin: "10px 5px 10px 10px",
      display: "inline-block",
      fontSize: 18,
    }
    const theme = createTheme({
      palette: {
        primary: {
          main: "#B5CC22"
        }
      },
    });
    return (
      <ThemeProvider theme={theme}>
        <div style={style}>
          <CheckBox
              checked={props.checked}
              onChange={(event) => { props.onCheck(event.target.checked); }}
              />
            &nbsp;&nbsp;{props.label}
        </div>
      </ThemeProvider>
    )

  }
}

function UbikeStopTable(props: {data: UbikeStop[]}): JSX.Element {
  if (props.data.length == 0) return <></>;
  let style: CSSProperties = {
    borderCollapse: "collapse",
    margin: "25px 0",
    fontSize: "0.9em",
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
    }
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
  let style: CSSProperties = {
    width: 277,
    top: 192,
    left: 315,
    padding: "8px 16px 8px 16px",
    borderRadius: 8,
    border: "none",
    outline: "none",
    marginLeft: 16,
    backgroundColor: "#F6F6F6",
    fontFamily: "Noto Sans CJK TC",
    fontSize: 18,
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
    <>
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
    </>
  )
}

function RegionSelect(props: {
  filterText: string;
  region: string,
  setRegion(region: string): void
}): JSX.Element {
  const regionList = getRegionList();
  let style: CSSProperties = {
    width: 175,
    height: 40,
    left: 124,
    padding: "8px 16px 8px 16px",
    borderRadius: 8,
    border: "none",
    outline: "none",
    backgroundColor: "#F6F6F6",
    fontSize: 18
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