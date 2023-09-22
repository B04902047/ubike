import BikeStopsInfo from "../BikeStopsInfo";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./Header";

function MobilePage(): JSX.Element {
  
  return <div>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Header/>}>
          <Route path="manual" element={<></>}/>
          <Route path="charging" element={<></>}/>
          <Route path="bikeStopsInfo" element={<BikeStopsInfo/>}/>
          <Route path="news" element={<></>}/>
          <Route path="events" element={<></>}/>
        </Route>
      </Routes>
    </BrowserRouter>
</div>;
}

export default MobilePage;