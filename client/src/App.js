import React, { useRef, useEffect, useState } from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'

import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import geoJson from "./aquariums.json";
import ReviewPage from './ReviewPage';

mapboxgl.accessToken = 'pk.eyJ1IjoiYW1ib3Juc3RlaW4iLCJhIjoiY2x3ajhnYjBjMHk1cDJrbXdjZHdqaWZ3cyJ9._K7RJ6SvA6Tg2VtuZjfCig';

export default function App() {
  
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [lng, setLng] = useState(-70.9);
    const [lat, setLat] = useState(42.35);
    const [zoom, setZoom] = useState(9);

    async function fetchData() {
      const response = await fetch(
        `http://localhost:5050/record/`
      );
      if (!response.ok) {
        const message = `An error has occurred: ${response.statusText}`;
        console.error(message);
        return;
      }
      const record = await response.json();
      return record
    }

    useEffect(() => {
        fetchData()
        if (map.current) return; // initialize map only once
        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/streets-v12',
          center: [lng, lat],
          zoom: zoom
        });
        map.current.on('move', () => {
            setLng(map.current.getCenter().lng.toFixed(4));
            setLat(map.current.getCenter().lat.toFixed(4));
            setZoom(map.current.getZoom().toFixed(2));
          });
        map.current.on('load', async () => {
          let response = await fetchData()
          console.log(response)
          response.map((feature) =>
            new mapboxgl.Marker().setLngLat(feature.geometry.coordinates).setPopup(
              new mapboxgl.Popup({ offset: 25 }) // add popups
                .setHTML(
                  `<h3>${feature.properties.name}</h3><p>${feature.properties.address}</p><a href="/pages/1">Review</Link>`
                )
            ).addTo(map.current)
          )
          });
      });
      
      return (
        <Router>
          <Routes>
            <Route path='/'
              element = {<div>
                <div className="sidebar">
                  Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
                </div>
                <div ref={mapContainer} className="map-container" />
              </div>}
            />
            <Route path='/pages/:id'
              component = {ReviewPage}
            />
          </Routes>
        </Router>
      );
    }