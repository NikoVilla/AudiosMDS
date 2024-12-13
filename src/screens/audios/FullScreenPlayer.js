import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Fade } from '@mui/material';
import './../../index.css';

const backendUrl = process.env.REACT_APP_BACKEND_URL;

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
      const token = localStorage.getItem('token');
      axios.get(`${backendUrl}/current-track`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
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
      const token = localStorage.getItem('token');
      axios.get(`${backendUrl}/images-list`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then((response) => {
        setImages(response.data);
        console.log('Images fetched from server:', response.data);
      })
      .catch((error) => {
        console.error('Error fetching images', error);
      });
    };

    fetchImages();
    const intervalId = setInterval(fetchImages, 5000);
  
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (!track && images.length > 0) {
      const intervalId = setInterval(() => {
        setFade(false);
        setTimeout(() => {
          setCurrentImageIndex((prevIndex) => {
            const nextIndex = (prevIndex + 1) % images.length;
            return images[nextIndex] ? nextIndex : 0;
          });
          setFade(true);
        }, 1000); 
      }, 5000);

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
            // objectFit: 'cover' 
          }} />
          <audio id="audio-player" src={track.url} autoPlay />
          {track.amount && (
            <div style={{ 
              position: 'absolute', 
              left: '50%', 
              top: '59%',
              transform: 'translateX(-50%)', 
              color: '#FFFFFF',
              // color: '#E9BA38', 
              fontFamily: 'Anton', 
              fontSize: '11vw',
              textShadow: '4px 4px 8px rgba(0, 0, 0, 0.9)',
              textAlign: 'center',
              whiteSpace: 'nowrap'
            }}>
              {formatAmount(track.amount)}
            </div>
          )}
        </>
      ) : (
        images.length > 0 ? (
          <Fade in={fade} timeout={1000}>
            {images[currentImageIndex] ? (
              <img
                src={images[currentImageIndex].url}
                alt="Clonacion"
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover' 
                }}
              />
            ) : null}
          </Fade>
        ) : (
          <div style={{ 
            width: '100%', 
            height: '100%', 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center' 
          }}>
            <p style={{ color: 'white', fontSize: '2vw' }}>Cargando imágenes...</p>
          </div>
        )
      )}
    </div>
  );  
};

export default FullScreenPlayer;