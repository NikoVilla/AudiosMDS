import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AudioPlayer from './AudioPlayer';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Header from '../../shared/Header';
import Sidebar from '../../shared/sidebar';

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const TrackPlayer = () => {
  const [tracks, setTracks] = useState([]);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(null);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  useEffect(() => {
    axios.get(`${backendUrl}/files`)
      .then((response) => {
        const formattedTracks = response.data.map(file => ({
          url: file.url,
          title: file.title,
          tags: [file.title],
          imageUrl: file.imageUrl,
        }));
        setTracks(formattedTracks);
        console.log('Fetched tracks:', formattedTracks);
      })
      .catch((error) => {
        console.error('Error fetching tracks', error);
      });
  }, []);

  const handleTrackSelect = (track, amount) => {
    const trackWithAmount = { ...track, amount: amount.replace(/\./g, '').replace(/,/g, '.') };
    setCurrentTrack(trackWithAmount);
    
    axios.post(`${backendUrl}/select-track`, trackWithAmount, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(() => {
      console.log('Track and amount selected and sent to server:', trackWithAmount);
    })
    .catch((error) => {
      console.error('Error sending track and amount to server', error);
    });
  };  

  const handleTrackStop = () => {
    setCurrentTrack(null);
    axios.post(`${backendUrl}/select-track`, {}, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(() => {
      console.log('Track stopped and sent to server');
    })
    .catch((error) => {
      console.error('Error sending stop to server', error);
    });
  };

  const handleListItemClick = (item) => {
    setActiveItem(item);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', backgroundColor: '#000000', color: 'white', height: '100vh', overflow: 'hidden'}}>
      <Box sx={{ flexShrink: 0 }}>
        <Header toggleDrawer={toggleDrawer} />
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
        <Sidebar open={open} toggleDrawer={toggleDrawer} handleListItemClick={handleListItemClick} activeItem={activeItem} />
        
        {tracks.length > 0 ? (
          <AudioPlayer
            tracks={tracks}
            onTrackSelect={handleTrackSelect}
            onTrackStop={handleTrackStop}
            sx={{
              marginBottom: 0,
            }}
          />
        ) : (
          <Box display="flex" justifyContent="center" alignItems="center" height="20vh">
            <CircularProgress />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default TrackPlayer;