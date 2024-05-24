import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import { baseUrl } from '../config';

mapboxgl.accessToken = 'pk.eyJ1IjoiYW1ib3Juc3RlaW4iLCJhIjoiY2x3ajhnYjBjMHk1cDJrbXdjZHdqaWZ3cyJ9._K7RJ6SvA6Tg2VtuZjfCig';

export default function AquariumMap() {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [lng, setLng] = useState(-70.9);
    const [lat, setLat] = useState(42.35);
    const [zoom, setZoom] = useState(9);

    async function fetchData() {
      const response = await fetch(
        `${baseUrl}/aquariums/`
      ).catch((error) => { console.log("Failed to fetch locations") } );
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
          await fetchData().then( (features) =>
            features.map((feature) =>
              new mapboxgl.Marker().setLngLat(feature.geometry.coordinates).setPopup(
                new mapboxgl.Popup({ offset: 25 }) // add popups
                  .setHTML(
                    `<h3>${feature.properties.name}</h3><p>${feature.properties.address}</p><a href="/pages/${feature._id}">Review</Link>`
                  )
              ).addTo(map.current)
            )
          ).catch((error) => { return Promise.reject() })
          });
      },[lat, lng, zoom]);

    return (
    <div>
      <div ref={mapContainer} className="map-container">
        <div className="sidebar">
          Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
        </div>
      </div>
    </div>
    )
}
