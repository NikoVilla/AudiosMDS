import React, { useState } from 'react';
import { Box, TextField, FormControlLabel, IconButton, Typography } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import { styled } from '@mui/material/styles';
import Switch from '@mui/material/Switch';

const CustSwitch = styled(Switch)(({ theme }) => ({
  padding: 8,
  '& .MuiSwitch-track': {
    borderRadius: 22 / 2,
    backgroundColor: theme.palette.grey[400],
    '&::before, &::after': {
      content: '""',
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      width: 16,
      height: 16,
    },
    '&::before': {
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
        theme.palette.getContrastText(theme.palette.primary.light),
      )}" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/></svg>')`,
      left: 12,
    },
    '&::after': {
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
        theme.palette.getContrastText(theme.palette.primary.light),
      )}" d="M19,13H5V11H19V13Z" /></svg>')`,
      right: 12,
    },
  },
  '& .MuiSwitch-thumb': {
    backgroundColor: theme.palette.warning.main,
    boxShadow: 'none',
    width: 16,
    height: 16,
    margin: 2,
    '&.Mui-checked': {
      backgroundColor: theme.palette.warning.main,
    },
  },
}));

const TextSwitch = ({ enabled, setEnabled, text, setText }) => {
  const handleSwitchChange = (event) => {
    setEnabled(event.target.checked);
  };

  const handleClearText = () => {
    setText('');
  };

  return (
    <Box sx={{ml: 0.5}}>
      <FormControlLabel
        control={
          <CustSwitch
            checked={enabled}
            onChange={handleSwitchChange}
            name="enabled"
          />
        }
        label={
          <Typography
            sx={{
              fontSize: { xs: 9, sm: 18},
              fontFamily: 'Nunito, sans-serif',
              fontWeight: 400,
            }}
          >
            Habilitar texto
          </Typography>
        }
      />
      {enabled && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-start',
            mt: 1,
            width: '100%',
            height: '100%',
            position: 'relative'
          }}
        >
          <TextField
            fullWidth
            label="Ingresar texto"
            value={text}
            onChange={(e) => setText(e.target.value)}
            InputProps={{
              style: {
                backgroundColor: '#262626',
                color: 'white',
                height: '90%',
                borderRadius: 10,
              }
            }}
            InputLabelProps={{
              shrink: true,
              required: false,
              style: { color: 'white', fontFamily: 'Nunito, sans-serif', fontWeight: 600, fontSize: 18 }
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '&.Mui-focused fieldset': {
                  borderColor: '#FFA800',
                },
              },
              '& .MuiInputLabel-root': {
                color: 'white',
              },
            }}
          />
          <IconButton
            onClick={handleClearText}
            sx={{
              position: 'absolute',
              top: '50%',
              right: 0,
              transform: 'translateY(-65%)',
              color: 'white',
              textAlign: 'right'
            }}
          >
            <ClearIcon />
          </IconButton>
        </Box>
      )}
    </Box>
  );
};

export default TextSwitch;
