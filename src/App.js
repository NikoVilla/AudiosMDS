import React from 'react';
import './App.css';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './screens/login/Login';
import Media from './screens/media/Media';
import TrackPlayer from './screens/audios/TrackPlayer';
import FullScreenPlayer from './screens/audios/FullScreenPlayer';
import Users from './screens/users/Users';
import { AuthProvider } from './AuthContext';
// import ProtectedRoute from './ProtectedRoute';
import Marketing from './screens/marketing/Marketing'
import FullScreenMedia from './screens/media/FullScreenMedia.js';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/audios" element={< TrackPlayer />} />
          <Route path="/audios/sala" element={< FullScreenPlayer />} />
          {/* <Route path="/media" element={<ProtectedRoute component={Media} />} /> +Ejemplo+*/}
          <Route path="/media" element={<Media />} />
          <Route path="/marketing" element={<Marketing />} />
          <Route path="/media/sala" element={<FullScreenMedia />} />
          <Route path="/usuarios" element={<Users />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;