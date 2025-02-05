import React, { useState, useRef, useEffect } from 'react';
import { IconButton, Box, FormControl, InputLabel, OutlinedInput, InputAdornment, ListItem, List, Typography } from '@mui/material';
import StopIcon from '@mui/icons-material/Stop';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ClearIcon from '@mui/icons-material/Clear';

const AudioPlayer = ({ tracks, onTrackSelect, onTrackStop }) => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const audioRef = useRef(null);

  const currentTrack = currentTrackIndex !== null ? tracks[currentTrackIndex] : null;

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying && currentTrack) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrack]);

  const handleStop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setCurrentTrackIndex(null);
    onTrackStop();
  };

  const handleTrackClick = (index) => {
    setCurrentTrackIndex(index);
    onTrackSelect(tracks[index], amount);
    setIsPlaying(true);
  };

  const formatAmount = (value) => {
    const numericValue = value.replace(/\D/g, '');

    if (numericValue.length > 1 && numericValue.startsWith('0')) {
      setError('Monto no válido. No se permiten ceros a la izquierda.');
      return '';
    }

    setError('');
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  const handleAmountChange = (event) => {
    const value = event.target.value;
    const formattedValue = formatAmount(value);
    setAmount(formattedValue);
  };

  const handleClearAmount = () => {
    setAmount('');
    setError('');
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh" minWidth="110vh">
      <Box
        className="audio-player"
        bgcolor="#18191f"
        color="white"
        p={2}
        borderRadius="10px"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        width={{ xs: '90%', sm: '75%', md: '75%', lg: '75%' }}
        height={{ xs: '100%', sm: '90%', md: '90%', lg: '90%' }}
      >
        {currentTrack && (
          <audio ref={audioRef} src={currentTrack.url} onEnded={handleStop} />
        )}
        <Box display="flex" flexDirection="column" alignItems="center" gap={4} fontSize={23} flexWrap="wrap" justifyContent="center">
          <Box display="flex" gap={3} alignItems="center" justifyContent="center">
            {tracks.map((track, index) => {
              const isActive = index === currentTrackIndex;
              return (
                <Box
                  key={index}
                  onClick={() => handleTrackClick(index)}
                  className={`track ${isActive ? 'active' : ''}`}
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                  textAlign="center"
                  width="100px"
                  height="100px"
                  border={`2px solid ${isActive ? '#FFA800' : 'white'}`}
                  borderRadius="10px"
                  bgcolor={isActive ? '#FFA800' : '#18191f'}
                  color={isActive ? 'black' : 'white'}
                  sx={{ cursor: 'pointer' }}
                >
                  {track.title}
                </Box>
              );
            })}
            <IconButton onClick={handleStop} color="white" fontSize="2rem">
              <StopIcon sx={{ fontSize: '2.5rem', color: '#D42A2A' }} />
            </IconButton>
          </Box>
          
          <Box display="flex" justifyContent="center" alignItems="center" gap={1} flexWrap="nowrap" sx={{ width: '53%' }}>
            <FormControl fullWidth>
              <InputLabel
                htmlFor="outlined-adornment-amount"
                sx={{
                  color: 'white',
                  '&.Mui-focused': {
                    color: 'white',
                  },
                  '&.MuiFormLabel-filled': {
                    color: 'white',
                  },
                }}
              >
                Monto 
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-amount"
                startAdornment={
                  <InputAdornment position="start">
                    <AttachMoneyIcon sx={{ color: 'white' }} />
                  </InputAdornment>
                }
                label="Amount"
                value={amount}
                onChange={handleAmountChange}
                sx={{
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'white',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'white',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'white',
                  },
                  color: 'white',
                  backgroundColor: 'transparent',
                  '& .MuiInputBase-input': {
                    color: 'white',
                  },
                }}
              />
              {error && <div style={{ color: 'red', fontSize: 12 }}>{error}</div>}
            </FormControl>
            <IconButton onClick={handleClearAmount} sx={{ color: 'white' }}>
              <ClearIcon />
            </IconButton>
          </Box>
          <Box display="flex" flexDirection="column" alignItems="center">
            <List sx={{ color: 'white', fontSize: 11, marginTop: 3 }}>
              <ListItem>
                * Al presionar algún botón, se reproducirá una animación y sonido correspondiente al premio en la ruta /audios/sala.
              </ListItem>
              <ListItem>
                * Para detener la reproducción, simplemente presione el botón rojo "Stop".
              </ListItem>
              <ListItem>
                * El ingreso del monto no es obligatorio. 
              </ListItem>
            </List>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default AudioPlayer;