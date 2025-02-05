import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Fade } from '@mui/material';
import './../../index.css';

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const FullScreenMedia = () => {
  const [images, setImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const fetchImages = () => {
      const token = localStorage.getItem('token');
      axios.get(`${backendUrl}/media-full`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then((response) => {
        console.log('Response from backend:', response.data);
        setImages(response.data);
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
    if (images.length > 1) {
      const interval = setInterval(() => {
        setFade(false);
        setTimeout(() => {
          setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
          setFade(true);
        }, 800); 
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [images]);

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
      {images.length > 0 ? (
        <Fade in={fade} timeout={1000}>
          <img 
            src={images[currentImageIndex]?.url} 
            alt="Clonacion" 
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover' 
            }} 
          />
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
      )}
    </div>
  );  
};

export default FullScreenMedia;