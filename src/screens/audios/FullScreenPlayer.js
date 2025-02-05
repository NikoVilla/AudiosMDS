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
  const [fija, setFija] = useState(null);
  const [loading, setLoading] = useState(true);

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
    const fetchFija = () => {
      const token = localStorage.getItem('token');
      axios.get(`${backendUrl}/get-status`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then((response) => {
        const activeFija = response.data.find(item => item.status === 'activo');
        setFija(activeFija || null);
        console.log('Fija fetched from server:', activeFija);
      })
      .catch((error) => {
        console.error('Error fetching fija', error);
      });
    };

    fetchFija();
    const intervalId = setInterval(fetchFija, 5000);

    return () => clearInterval(intervalId);
  }, []);
  
  useEffect(() => {
    if (!track && images.length > 0) {
      const intervalId = setInterval(() => {
        setFade(false);
        setTimeout(() => {
          setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
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
              left: '46.5%', 
              top:'31%',
              transform: 'translateX(-50%)', 
              color: 'transparent', 
              fontFamily: 'Anton', 
              fontSize: '12vw',
              WebkitTextStroke: '9px #FFFFFF', 
              // textShadow: `
              //   0 0 90px #D49250`, 
              textAlign: 'center',
              whiteSpace: 'nowrap',
              padding: '20px',
              borderRadius: '15px',
              display: 'inline-block',
              width: '80%',
            }}>
              {formatAmount(track.amount)}
            </div>
          )}
        </>
      ) : fija ? (
        <img src={fija.image} alt="Fija" style={{ 
          width: '100%', 
          height: '100%', 
          objectFit: 'cover' 
        }} />
      ) : images.length > 0 ? (
        <Fade in={fade} timeout={1000}>
          <img
            src={images[currentImageIndex]?.url || ''}
            alt="Slideshow"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </Fade>
      ) : (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <p style={{ color: 'white', fontSize: '2vw' }}>No hay imágenes disponibles.</p>
        </div>
      )}
    </div>
  );
};

export default FullScreenPlayer;