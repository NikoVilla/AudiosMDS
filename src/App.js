import React from 'react';
import './App.css';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import TrackPlayer from './components/TrackPlayer';
import FullScreenPlayer from './components/FullScreenPlayer';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* <Route path="/" element={<Login />} /> */}
          <Route path="/" element={<TrackPlayer />} />
          <Route path="/sala" element={<FullScreenPlayer />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;