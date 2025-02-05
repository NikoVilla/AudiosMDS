import React, { useState } from 'react';
import axios from 'axios';
import { Container, Box, TextField, Button, Snackbar, InputAdornment, IconButton} from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LockIcon from '@mui/icons-material/Lock';
import './../../App.css';
import { useAuth } from './../../AuthContext';
import logo from './../../assets/logo-b-MDS-casino-oso.png';
import './../../index.css';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [connectionError, setConnectionError] = useState('');
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    let newErrors = { username: '', password: '' };
    
    if (!username) newErrors.username = 'El nombre de usuario es obligatorio';
    if (!password) newErrors.password = `La contraseña es obligatoria`;
    setErrors(newErrors);
    if (newErrors.username || newErrors.password) return;

    try {
      const response = await axios.post(
        `${backendUrl}/login`, 
        { username, password }, 
        { headers: { 'Content-Type': 'application/json' } }
      );
  
      const { token } = response.data;
      localStorage.setItem('token', token);
      
      login();
      setUsername('');
      setPassword('');
    } catch (error) {
      if (error.response) {
        setLoginError('Credenciales incorrectas');
        setTimeout(() => setLoginError(''), 1000);
      } else {
        setConnectionError(`Error de conexión con el servidor`);
        setTimeout(() => setConnectionError(''), 1000);
      }
    }
  };

  const handleClickShowPassword = () => setShowPassword((prev) => !prev);

  return (
    <Box
      sx={{
        backgroundColor: '#262626',
        color: 'white',
        height: '100vh',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        overflow: 'auto', 
      }}
    >
      <Container
        component="main"
        maxWidth="sm"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          padding: '20px',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: 3,
            boxShadow: 3,
            borderRadius: 7,
            backgroundColor: '#000000',
            width: '100%',
            maxWidth: 400,
            justifyContent: 'space-between',
            boxSizing: 'border-box',
            overflow: 'auto',
            '@media (max-width: 600px)': {
              padding: 2,
              maxWidth: '100%',
              boxShadow: 'none',
            },
          }}
        >
          <img src={logo} className="App-logo" alt="logo" style={{ width: '60%', height: 'auto' }} />
          <Box component="form" noValidate sx={{ width: '100%' }} onSubmit={handleSubmit}>
            {loginError && (
              <Snackbar open={!!loginError} autoHideDuration={2000} onClose={() => setLoginError('')}>
                <Alert onClose={() => setLoginError('')} severity="error" sx={{ width: '100%' }}>
                  {loginError}
                </Alert>
              </Snackbar>
            )}
            {connectionError && (
              <Snackbar open={!!connectionError} autoHideDuration={2000} onClose={() => setConnectionError('')}>
                <Alert onClose={() => setConnectionError('')} severity="error" sx={{ width: '100%' }}>
                  {connectionError}
                </Alert>
              </Snackbar>
            )}
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="username"
              label="Nombre de usuario"
              name="username"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              error={!!errors.username}
              helperText={errors.username}
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
                  '&.Mui-focused fieldset': {
                    borderColor: '#FFA800',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'white',
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
              type={showPassword ? "text" : "password"}
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={!!errors.password}
              helperText={errors.password}
              InputProps={{
                startAdornment: (
                  <LockIcon position="start" style={{ color: '#FFA800', marginRight: '12px' }} />
                ),
                style: { backgroundColor: '#262626', color: 'white', borderRadius: 15, paddingLeft: '12px' },
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleClickShowPassword} edge="end">
                      {showPassword ? <VisibilityOff style={{ color: '#FFA800'}} /> : <Visibility style={{ color: '#FFA800' }} />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              InputLabelProps={{
                shrink: true,
                required: false,
                style: { color: 'white', fontFamily: 'Nunito, sans-serif', fontWeight: 600, fontSize: 18 }
              }}
              sx={{
                mb: 3,
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
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 4,
                backgroundColor: '#FFA800',
                color: 'black',
                height: '52px',
                fontFamily: 'Nunito, sans-serif',
                fontWeight: 800,
                fontSize: 14,
                borderRadius: 3,
              }}
            >
              Iniciar Sesión
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Login;