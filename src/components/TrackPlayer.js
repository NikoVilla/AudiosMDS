import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AudioPlayer from './AudioPlayer';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import ClearIcon from '@mui/icons-material/Clear';
import logo from './../logo-b-MDS-casino-oso.png';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

const TrackPlayer = () => {
  const [tracks, setTracks] = useState([]);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');

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
    const trackWithAmount = { ...track, amount: amount.replace(/\./g, '').replace(/,/g, '.') };
    setCurrentTrack(trackWithAmount);
    axios.post('http://192.168.43.72:3001/select-track', trackWithAmount, {
      headers: {
        'Content-Type': 'application/json'
      }
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
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        sx={{
          width: '100%',
          maxWidth: '375px',
          marginTop: '40px',
        }}
      >
        <FormControl fullWidth sx={{ m: 1 }}> 
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
              '&.MuiFormLabel-animated': {
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
              '&:focus': {
                backgroundColor: 'transparent',
              },
              '&:focus-visible': {
                outline: 'none',
              },
            }}
          />
          {error && <div style={{ color: 'red', fontSize: 12}}>{error}</div>}
        </FormControl>
        <IconButton 
          onClick={handleClearAmount}
          sx={{ marginLeft: '10px', color: 'white'}}
        >
          <ClearIcon />
        </IconButton>
      </Box>
    </div>
  );
};

export default TrackPlayer;