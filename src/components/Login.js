import React from 'react';
import { Container, Box, TextField, Button } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LockIcon from '@mui/icons-material/Lock';
import './../App.css';
import logo from './../logo-b-MDS-casino-oso.png';

const Login = () => {
  return (
    <div className="App-background">
      <Container component="main" maxWidth="md" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            // width: '100%',
            padding: 2,
            boxShadow: 3,
            borderRadius: 7,
            backgroundColor: '#000000',
            height: '70vh', 
            width: '55vh',
            justifyContent: 'space-between',
            paddingTop: 4,
            paddingBottom: 4,
          }}
        >
          <img src={logo} className="App-logo" alt="logo" style={{ 
            width: '70%', 
            height: 'auto', 
          }}/>
          <Box component="form" noValidate sx={{ width: '80%', mt: 2 }}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="username"
              label="Nombre de usuario"
              name="username"
              autoComplete="username"
              autoFocus
              InputProps={{
                startAdornment: (
                  <AccountCircleIcon position="start" style={{ color: '#FFA800' }} />
                ),
                style: { backgroundColor: '#262626', color: 'white', borderRadius: 5 }
              }}
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: '#FFA800',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#FFA800',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'white',
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#FFA800',
                },
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
                  <LockIcon position="start" style={{ color: '#FFA800' }} />
                ),
                style: { backgroundColor: '#262626', color: 'white', borderRadius: 5 }
              }}
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: '#FFA800',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#FFA800',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'white',
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#FFA800',
                },
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, backgroundColor: '#FFA800', color: 'black', padding: '10px 0', height: '56px' }}
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
