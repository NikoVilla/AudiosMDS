import React from 'react';
import './App.css';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import TrackPlayer from './components/TrackPlayer';
import FullScreenPlayer from './components/FullScreenPlayer';
import Login from './components/Login';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/sala" element={<TrackPlayer />} />
          <Route path="/audios/sala" element={<FullScreenPlayer />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;