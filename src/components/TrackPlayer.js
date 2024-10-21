import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AudioPlayer from './AudioPlayer';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import logo from './../assets/logo-b-MDS-casino-oso.png';

const TrackPlayer = () => {
  const [tracks, setTracks] = useState([]);
  const [currentTrack, setCurrentTrack] = useState(null);

  useEffect(() => {
    axios.get('http://192.168.43.72:3001/files')
      .then((response) => {
        const formattedTracks = response.data.map(file => ({
          url: file.url,
          title: file.title,
          tags: [file.title],
          imageUrl: file.imageUrl
        }));
        setTracks(formattedTracks);
        console.log('Fetched tracks:', formattedTracks);
      })
      .catch((error) => {
        console.error('Error fetching tracks', error);
      });
  }, []);

  const handleTrackSelect = (track) => {
    setCurrentTrack(track);
    axios.post('http://192.168.43.72:3001/select-track', track, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(() => {
      console.log('Track selected and sent to server:', track);
    })
    .catch((error) => {
      console.error('Error sending track to server', error);
    });
  };

  const handleTrackStop = () => {
    setCurrentTrack(null);
    axios.post('http://192.168.43.72:3001/select-track', {}, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(() => {
      console.log('Track stopped and sent to server');
    })
    .catch((error) => {
      console.error('Error sending stop to server', error);
    });
  };

  return (
    <div className="App-header">
      <img src={logo} className="App-logo" alt="logo" />
      {tracks.length > 0 ? (
        <AudioPlayer
          tracks={tracks}
          onTrackSelect={handleTrackSelect}
          onTrackStop={handleTrackStop}
        />
      ) : (
        <Box display="flex" justifyContent="center" alignItems="center" height="20vh">
          <CircularProgress />
        </Box>
      )}
    </div>
  );
};

export default TrackPlayer;
