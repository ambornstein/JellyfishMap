import React from 'react';
import ReactDOM from 'react-dom';
import 'mapbox-gl/dist/mapbox-gl.css';
import './index.css';
import App from './App';

const uri = "mongodb+srv://amborn02:kqGQwjxmrRrKVWWy@cluster0.qq9w1kr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

ReactDOM.render(
  <App />,
  document.getElementById('root')
);