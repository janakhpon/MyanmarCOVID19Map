import React, { useState, useEffect } from "react";
import 'react-leaflet-fullscreen/dist/styles.css'
import FullscreenControl from 'react-leaflet-fullscreen';
import 'leaflet-easyprint';
import { Map, Marker, Popup, TileLayer, withLeaflet } from "react-leaflet";
import { Icon } from "leaflet";
import { csv } from 'd3'
import PrintControlDefault from 'react-leaflet-easyprint';

import "./Styles/style.scss"

export const iconred = new Icon({
  iconUrl: "/Map_marker_red.svg",
  iconSize: [75, 75]
});

export const iconyellow = new Icon({
  iconUrl: "/Map_marker_yello.svg",
  iconSize: [50, 50]
});


export const icongreen = new Icon({
  iconUrl: "/Map_marker.svg",
  iconSize: [25, 25]
});

const PrintControl = withLeaflet(PrintControlDefault);

export default function App() {
  const [data, setData] = useState([])

  useEffect(() => {
    csv('https://raw.githubusercontent.com/theananda/myanmar-covid19-data/master/MOHS_Dashboard_Data/MOHS%20Dashboard%20Data.csv')
      .then((d, error) => {
        if (error) {

        } else {
          console.log(d)
          let host = []
          d.map(val => {
            let geticonval

            if (val.Confirmed === 0 || val.Confirmed === '0' || val.Confirmed === null || val.Confirmed === '' || val.Pending === '0' || val.Pending === 0) {
              geticonval = icongreen
            } else {
              geticonval = iconyellow
            }


            let formatted = {
              Region: val.SR, Township: val.Township, Hospital: val.Hospital, Pending: val.Pending, Confirmed: val.Confirmed,
              Fulllocation: `${val.SR}/${val.Township}`, Latitude: val.Latitude, Longitude: val.Longitude, Death: val.Death, Icon: geticonval,
              Suspected: val.Suspected, PUI: val.PUI, Male: val.M, Female: val.F
            }
            return host.push(formatted)
          })

          setData(host)
        }
      })
  }, [])



  return (

    <Map center={[16.920552, 96.156532]} zoom={5}>
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url='https://{s}.tile.osm.org/{z}/{x}/{y}.png'
      />

      {
        data.map((d, key) => (

          <Marker
            position={
              [
                d.Latitude,
                d.Longitude
              ]
            }
            icon={d.Death === "0" ? d.Icon : iconred}
            key={key}

            onMouseOver={(e) => {
              e.target.openPopup();
            }}
            onMouseOut={(e) => {
              e.target.closePopup();
            }}

          >
            <Popup className="request-popup">
              <span>{d.Fulllocation} <br />
                {d.Suspected} Suspected victims <br />
                {d.PUI} victims under surveillance <br />
                {d.Male} Male victims - {d.Female} Female victims <br />
                {d.Pending} Lab Pending victims <br />
                {d.Confirmed} confirmed victims <br />
                {d.Death} Death victims <br />
                {d.Hospital} </span>
            </Popup>

          </Marker>
        ))
      }
      {
        data.map(d => {
          console.log(d.Confirmed === 0 && d.Pending === 0 ? true : false)
          return null
        })
      }


      )}
      <FullscreenControl position="topright" />
      <PrintControl position="topleft" sizeModes={['Current', 'A4Portrait', 'A4Landscape']} hideControlContainer={false} />
      <PrintControl position="topleft" sizeModes={['Current', 'A4Portrait', 'A4Landscape']} hideControlContainer={false} title="Export as PNG" exportOnly />
    </Map>
  );
}
