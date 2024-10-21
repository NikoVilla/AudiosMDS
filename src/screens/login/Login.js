import React from 'react';
import { Container, Box, TextField, Button } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LockIcon from '@mui/icons-material/Lock';
import './../../App.css';
import logo from './../../assets/logo-b-MDS-casino-oso.png';
import './../../index.css';

const Login = () => {
  return (
    <div className="App-background">
      <Container component="main" maxWidth="md" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: 2,
            boxShadow: 3,
            borderRadius: 7,
            backgroundColor: '#000000',
            height: '70vh',
            width: '55vh',
            justifyContent: 'flex-start',
            paddingBottom: 4,
          }}
        >
          <img src={logo} className="App-logo" alt="logo" style={{ 
            width: '70%', 
            height: 'auto', 
          }}/>
          <Box component="form" noValidate sx={{ width: '80%', mt: 5 }}> 
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="username"
              label="Nombre de usuario"
              name="username"
              autoComplete="username"
              InputProps={{
                startAdornment: (
                  <AccountCircleIcon position="start" style={{ color: '#FFA800', marginRight: '12px' }} />
                ),
                style: { backgroundColor: '#262626', color: 'white', borderRadius: 15, paddingLeft: '12px' }
              }}
              InputLabelProps={{
                shrink: true,
                required: false,
                style: { color: 'white', fontFamily: 'Nunito, sans-serif', fontWeight: 600, fontSize: 18 }
              }}
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  // '&:hover fieldset': {
                  //   borderColor: '#FFA800',
                  // },
                  '&.Mui-focused fieldset': {
                    borderColor: '#FFA800',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'white',
                },
                // '& .MuiInputLabel-root.Mui-focused': {
                //   color: '#FFA800',
                // },
              }}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Contraseña"
              type="password"
              id="password"
              autoComplete="current-password"
              InputProps={{
                startAdornment: (
                  <LockIcon position="start" style={{ color: '#FFA800', marginRight: '12px' }} />
                ),
                style: { backgroundColor: '#262626', color: 'white', borderRadius: 15, paddingLeft: '12px' }
              }}
              InputLabelProps={{
                shrink: true,
                required: false,
                style: { color: 'white', fontFamily: 'Nunito, sans-serif', fontWeight: 600, fontSize: 18}
              }}
              sx={{
                mb: 3, 
                '& .MuiOutlinedInput-root': {
                  // '&:hover fieldset': {
                  //   borderColor: '#FFA800',
                  // },
                  '&.Mui-focused fieldset': {
                    borderColor: '#FFA800',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'white',
                },
                // '& .MuiInputLabel-root.Mui-focused': {
                //   color: '#FFA800',
                // },
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 8, mb: 2, backgroundColor: '#FFA800', color: 'black', height: '52px', fontFamily: 'Nunito, sans-serif', fontWeight: 800, fontSize: 14, borderRadius: 5 }}
            >
              Iniciar Sesión
            </Button>
          </Box>
        </Box>
      </Container>
    </div>
  );
};

export default Login;