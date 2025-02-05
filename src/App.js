import React from 'react';
import './App.css';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
<<<<<<< HEAD
import TrackPlayer from './components/TrackPlayer';
import FullScreenPlayer from './components/FullScreenPlayer';
import logo from './logo-b-MDS-casino-oso.png';
=======
import Login from './screens/login/Login';
import Media from './screens/media/Media';
import TrackPlayer from './screens/audios/TrackPlayer';
import FullScreenPlayer from './screens/audios/FullScreenPlayer';
import Users from './screens/users/Users';
import { AuthProvider } from './AuthContext';
// import ProtectedRoute from './ProtectedRoute';
import Marketing from './screens/marketing/Marketing'
import FullScreenMedia from './screens/media/FullScreenMedia.js';
>>>>>>> dev

function App() {
  return (
    <Router>
<<<<<<< HEAD
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <Routes>
            <Route path="/" element={<TrackPlayer />} />
            <Route path="/fullscreen" element={<FullScreenPlayer />} />
          </Routes>
        </header>
      </div>
=======
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
>>>>>>> dev
    </Router>
  );
}

export default App;