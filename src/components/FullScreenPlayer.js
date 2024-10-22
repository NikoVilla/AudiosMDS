import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Fade } from '@mui/material';
import './../index.css';

const FullScreenPlayer = () => {
  const [track, setTrack] = useState(null);
  const [images, setImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [fade, setFade] = useState(true);

  const formatAmount = (amount) => {
    const numericValue = Number(amount);
    return `$ ${numericValue.toLocaleString('es-CL')}`;
  };

  useEffect(() => {
    const fetchCurrentTrack = () => {
      axios.get('http://192.168.43.72:3001/current-track')
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

  useEffect(() => {
    const fetchImages = () => {
      axios.get('http://192.168.43.72:3001/images-list')
        .then((response) => {
          setImages(response.data);
        })
        .catch((error) => {
          console.error('Error fetching images', error);
        });
    };

    fetchImages();
  }, []);

  useEffect(() => {
    if (!track && images.length > 0) {
      const intervalId = setInterval(() => {
        setFade(false);
        setTimeout(() => {
          setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
          setFade(true);
        }, 1000); 

      }, 7000);

      return () => clearInterval(intervalId);
    }
  }, [track, images]);

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
          {track.amount && (
            <div style={{ 
              position: 'absolute', 
              bottom: '5%', 
              left: '50%', 
              transform: 'translateX(-50%)', 
              color: 'red', 
              fontFamily: 'Lobster', 
              fontSize: 150,
              textShadow: '4px 4px 8px rgba(0, 0, 0, 0.7)'
            }}>
              {formatAmount(track.amount)}
            </div>
          )}
        </>
      ) : (
        images.length > 0 ? (
          <Fade in={fade} timeout={1000}>
            <img src={images[currentImageIndex].url} alt="Publicidad" style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover' 
            }} />
          </Fade>
        ) : (
          <div style={{ 
            width: '100%', 
            height: '100%', 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center' 
          }}>
            <p style={{ color: 'white' }}>Cargando imágenes...</p>
          </div>
        )
      )}
    </div>
  );
};

export default FullScreenPlayer;