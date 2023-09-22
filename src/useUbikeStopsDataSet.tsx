

import axios, { AxiosResponse } from 'axios';
import { useState, useEffect } from 'react';
import UbikeStop from './UbikeStop';

function useUbikeStopsDataSet() {
    let [ubikeStops, setUbikeStops] = useState<UbikeStop[]>([]);
    useEffect(() => {
      axios.get("https://tcgbusfs.blob.core.windows.net/dotapp/youbike/v2/youbike_immediate.json")
        .then((response: AxiosResponse<any[], any>) => {
          let data: UbikeStop[] = response.data.map(stop => {
            return {
              id: stop.sno,
              city: "台北市",
              name: stop.sna.split('_')[1],
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

export default useUbikeStopsDataSet;