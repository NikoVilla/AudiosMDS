import React from 'react';
import './App.css';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import TrackPlayer from './screens/audios/TrackPlayer';
import FullScreenPlayer from './screens/audios/FullScreenPlayer';
import Login from './screens/login/Login';
import Media from './screens/media/Media';
import Users from './screens/users/Users';
import Sidebar from './components/sidebar'

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* <Route path="/" element={<Sidebar />} />   */}
          <Route path="/" element={<Login />} />
          <Route path="/audios" element={<TrackPlayer />} />
          <Route path="/audios/sala" element={<FullScreenPlayer />} />
          <Route path="/media" element={<Media />} />
          <Route path="/usuarios" element={<Users />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;