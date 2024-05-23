import React, { useRef, useEffect, useState } from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
//import { MongoClient, ServerApiVersion } from "mongodb";
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
    // const client = new MongoClient(uri,  {
    //   serverApi: {
    //       version: ServerApiVersion.v1,
    //       strict: true,
    //       deprecationErrors: true,
    //   }
    // })

    useEffect(() => {
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
        map.current.on('load', () => {
          geoJson.features.map((feature) =>
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