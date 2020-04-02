import React, { useState, useEffect } from "react";
import { Map, Marker, Popup, TileLayer } from "react-leaflet";
import { Icon } from "leaflet";
import { csv } from 'd3'
import "./App.css";

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


export default function App() {
  const [data, setData] = useState([])

  useEffect(() => {
    csv('https://raw.githubusercontent.com/theananda/myanmar-covid19-data/master/MOHS%20Dashboard%20Data.csv')
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


            let formatted = { Region: val.SR, Township: val.Township, Hospital: val.Hospital, Pending: val.Pending, Confirmed: val.Confirmed, Fulllocation: `${val.SR}/${val.Township}`, Latitude: val.Latitude, Longitude: val.Longitude, Death: val.Death, Icon: geticonval }
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
        data.map(d => (

          <Marker
            position={
              [
                d.Latitude,
                d.Longitude
              ]
            }
            icon={d.Death === "0" ? d.Icon : iconred}

          >
            <Popup>
              <span>{d.Fulllocation} <br /> {d.Pending} suspected victims <br /> {d.Confirmed} confirmed victims <br /> {d.Death} Death victims <br /> {d.Hospital} </span>
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

      {/* {parkData.features.map(park => (
        <Marker
          key={park.properties.PARK_ID}
          position={[
            park.geometry.coordinates[1],
            park.geometry.coordinates[0]
          ]}
          onClick={() => {
            setActivePark(park);
          }}
          icon={icon}
        />
      ))}

      {activePark && (
        <Popup
          position={[
            activePark.geometry.coordinates[1],
            activePark.geometry.coordinates[0]
          ]}
          onClose={() => {
            setActivePark(null);
          }}
        >
          <div>
            <h2>{activePark.properties.NAME}</h2>
            <p>{activePark.properties.DESCRIPTIO}</p>
          </div>
        </Popup> */}
      )}
    </Map>
  );
}
