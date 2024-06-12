import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

import ReviewPage from './components/ReviewPage';
import AquariumMap from './components/AquariumMap';
import NavBar from './components/NavBar';
import LoginPopup from './components/LoginPopup';
import React, { useEffect, useState } from 'react';
import { baseUrl } from './config';

export default function App() {
  let [authed, setAuthed] = useState(false)
  let stored = JSON.parse(localStorage.getItem("userInfo"))
  useEffect(() => {
    if (stored) {
      fetch(`${baseUrl}/verify?token=${stored.token}`).then((res) => {
        console.log(res.status)
        if (res.status == 200) {
          console.log("Token verified")
          setAuthed(true)
        }
      })
    }
  }, [])
  return (
    <>
      {!authed &&
        <LoginPopup />
      }
        <Router>
          <NavBar />
          <Routes>
            <Route path='/'
              element={<AquariumMap />}
            />
            <Route path='/pages/:id'
              element={<ReviewPage authed={authed} />}
            />
          </Routes>
        </Router>
    </>
  );
}