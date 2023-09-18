import React from 'react';

import './App.css';
import Header from './Header';
import Bie from './BikeStopsInfo';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import BikeStopsInfo from './BikeStopsInfo';

function App() {
  return (
    <div>
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
    </div>
  );
}

export default App;
