import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'

import ReviewPage from './components/ReviewPage';
import AquariumMap from './components/AquariumMap';

export default function App() {
      return (
        <Router>
          <Routes>
            <Route path='/'
              element = {<AquariumMap/>}
            />
            <Route path='/pages/:id'
              element = {<ReviewPage/>}
            />
          </Routes>
        </Router>
      );
    }