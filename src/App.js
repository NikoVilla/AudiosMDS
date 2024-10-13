import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import TrackPlayer from './components/TrackPlayer';
import FullScreenPlayer from './components/FullScreenPlayer';
import logo from './logo-b-MDS-casino-oso.png';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <Routes>
            <Route path="/" element={<TrackPlayer />} />
            <Route path="/fullscreen" element={<FullScreenPlayer />} />
          </Routes>
        </header>
      </div>
    </Router>
  );
}

export default App;