import React from 'react';
import './App.css';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import TrackPlayer from './screens/audios/TrackPlayer';
import FullScreen from './screens/audios/FullScreen';
import Login from './screens/login/Login';
import Media from './screens/media/Media';
import Users from './screens/users/Users';
import Sidebar from './components/sidebar'

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Sidebar />} />  
          <Route path="/" element={<Login />} />
          <Route path="/sala" element={<TrackPlayer />} />
          <Route path="/audios/sala" element={<FullScreen />} />
          <Route path="/media" element={<Media />} />
          <Route path="/usuarios" element={<Users />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;