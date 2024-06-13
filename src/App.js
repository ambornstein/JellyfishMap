import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

import ReviewPage from './components/ReviewPage';
import AquariumMap from './components/AquariumMap';
import NavBar from './components/NavBar';
import LoginPopup from './components/LoginPage';
import React from 'react';

export default function App() {
  return (
    <>
      <Router>
        <NavBar/>
        <Routes>
          <Route path='/'
            element={<AquariumMap />}
          />
          <Route path='/pages/:id'
            element={<ReviewPage />}
          />
          <Route path='/login'
            element={<LoginPopup />}
          />
        </Routes>
      </Router>
    </>
  );
}