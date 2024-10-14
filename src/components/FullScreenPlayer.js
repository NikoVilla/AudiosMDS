import React, { useEffect, useState } from 'react';
import axios from 'axios';
import logo from './../logo-b-MDS-casino-oso.png'

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
            setTrack(null); 
          }
        })
        .catch((error) => {
          console.error('Error fetching current track', error);
        });
    };

    fetchCurrentTrack();

    const intervalId = setInterval(fetchCurrentTrack, 1000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const handleAudioEnded = () => {
      setTrack(null);
    };

    const audioElement = document.getElementById('audio-player');
    if (audioElement) {
      audioElement.addEventListener('ended', handleAudioEnded);
    }

    return () => {
      if (audioElement) {
        audioElement.removeEventListener('ended', handleAudioEnded);
      }
    };
  }, [track]);

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
          <audio id="audio-player" src={track.url} autoPlay />
        </>
      ) : (
        <img src={logo} alt="Default" style={{ 
          width: '90%', 
          height: '90%', 
          objectFit: 'cover' 
          // centrar
        }} />
      )}
    </div>
  );
};

export default FullScreenPlayer;