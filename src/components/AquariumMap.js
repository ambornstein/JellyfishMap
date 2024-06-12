import React, { useRef, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import { baseUrl } from '../config';
import Rating from 'react-rating';

mapboxgl.accessToken = 'pk.eyJ1IjoiYW1ib3Juc3RlaW4iLCJhIjoiY2x3ajhnYjBjMHk1cDJrbXdjZHdqaWZ3cyJ9._K7RJ6SvA6Tg2VtuZjfCig';

export default function AquariumMap() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(-70.9);
  const [lat, setLat] = useState(42.35);
  const [zoom, setZoom] = useState(9);

  async function fetchLocationData() {
    const response = await fetch(
      `${baseUrl}/aquariums/`
    ).catch((error) => { console.log("Failed to fetch locations") });
    if (!response.ok) {
      const message = `An error has occurred: ${response.statusText}`;
      console.error(message);
      return;
    }
    const record = await response.json();
    return record
  }

  async function fetchReviewData(id) {
    const response = await fetch(
      `${baseUrl}/reviews/${id}`
    ).catch((error) => { console.log("Failed to fetch locations") });
    if (!response.ok) {
      const message = `An error has occurred: ${response.statusText}`;
      console.error(message);
      return;
    }
    const record = await response.json();
    return record
  }

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
    fetchLocationData().then((feature) => {
      feature.map((feature) => {
        const popup = new mapboxgl.Popup({ offset: 25 }) // add popups
          .setHTML(`<h3>${feature.properties.name}</h3><p>${feature.properties.address}</p><a href="/pages/${feature._id}">Review</a><Rating/>`)

        popup.on('open', async () => {
          const popupContent = popup.getElement().getElementsByClassName("mapboxgl-popup-content")[0];
          //Test if ratings have already been added to the popup
          if (popupContent.getElementsByClassName("ratings").length <= 0) {
            await fetchReviewData(feature._id).then((reviews) => {
              //console.log(reviews)
              if (reviews.length > 0) {
                const ratingNode = document.createElement("div")
                ratingNode.className = "ratings"
                //Add ratings from the most recent review
                ReactDOM.render(<>
                  <Rating readonly initialRating={reviews[reviews.length - 1].ovrRating} />
                  <Rating readonly initialRating={reviews[reviews.length - 1].jellyRating} />
                </>, ratingNode)

                popupContent.appendChild(ratingNode)
              }
            })
          }
        });

        return new mapboxgl.Marker().setLngLat(feature.geometry.coordinates).setPopup(popup).addTo(map.current)
      });
    })
  }, [lat, lng, zoom]);

  return (
    <div className="main-page">
      <div className="img-container">
      </div>
      <div ref={mapContainer} className="map-container">
        <div className="sidebar">
          Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
        </div>
      </div>
    </div>
  )
}
