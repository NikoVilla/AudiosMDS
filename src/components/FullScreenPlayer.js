import React, { useEffect, useState } from 'react';
import axios from 'axios';

const FullScreenPlayer = () => {
  const [track, setTrack] = useState(null);

  useEffect(() => {
    const fetchCurrentTrack = () => {
      axios.get('http://localhost:3001/current-track')
        .then((response) => {
          const currentTrack = response.data;
          console.log('Current track from server:', currentTrack);

          if (currentTrack) {
            setTrack(currentTrack);
            console.log('Track and imageUrl set:', currentTrack);
          } else {
            console.log('No track found on server');
          }
        })
        .catch((error) => {
          console.error('Error fetching current track', error);
        });
    };

    fetchCurrentTrack();

    // Poll the server periodically to check for updates
    const intervalId = setInterval(fetchCurrentTrack, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      width: '100%', 
      height: '100%', 
      backgroundColor: 'black', 
      zIndex: 9999 
    }}>
      {track ? (
        <>
          <img src={track.imageUrl} alt={track.title} style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover' 
          }} />
          <audio src={track.url} autoPlay />
        </>
      ) : (
        <p style={{ color: 'white', textAlign: 'center', marginTop: '20%' }}>No track found</p>
      )}
    </div>
  );
};

export default FullScreenPlayer;
