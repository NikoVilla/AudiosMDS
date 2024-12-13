import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import ChevronLeft from '@mui/icons-material/ChevronLeft';
import logo from './../assets/logo-b-MDS-casino-oso.png';
import { getLoggedInUser } from './../screens/users/ServiceUser';

export default function Header({ toggleDrawer }) {

  const [user, setUser] = useState({ first_name: '', last_name: '', role: '' });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const loggedUser = await getLoggedInUser();
        setUser(loggedUser);
      } catch (error) {
        console.error('Error al obtener los datos del usuario:', error);
      }
    };

    fetchUser();
  }, []); 

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        position: 'relative', 
        width: '100%',
        height: '65px', // Asegura que el Header tenga una altura fija
        backgroundColor: '#000000', 
        overflow: 'hidden', // Evita cualquier desbordamiento
        boxSizing: 'border-box', // Asegura que el padding no afecte el tamaño total del Box
      }}
    >
      {/* Imagen del logo */}
      <Box
        component="img"
        src={logo}
        alt="Logo"
        sx={{
          height: '100%', // La imagen ocupará todo el alto disponible
          width: 'auto', // Mantiene la proporción de la imagen
          objectFit: 'contain', // Asegura que la imagen no se deforme
          marginLeft: 2, 
        }}
      />
      
      {/* Contenedor con el nombre y cargo del usuario */}
      <Box 
        sx={{ 
          marginRight: 2, 
          color: 'white', 
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          height: '100%', 
          justifyContent: 'center', 
          overflow: 'hidden', 
          gap: 0.5,
        }} 
        onClick={toggleDrawer(true)} // Abre el sidebar aunque no esté cargado
      >
        <Box sx={{ display: 'flex', justifyContent: 'flex-end'}}>
          <Typography 
            sx={{ 
              color: 'white', 
              fontSize: { xs: 14, sm: 18 }, 
              fontFamily: 'Nunito, sans-serif', 
              fontWeight: 600 
            }}
            >
            {user.first_name && user.last_name 
              ? `${user.first_name} ${user.last_name}`.length > 15
                ? `${`${user.first_name} ${user.last_name}`.slice(0, 19)}...`
                : `${user.first_name} ${user.last_name}`
              : 'Cargando...'}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ChevronLeft sx={{ color: 'white', marginRight: 5 }} />
          <Typography variant="body2" sx={{ color: '#FFA800', fontSize: { xs: 16, sm: 16 }, fontFamily: 'Nunito, sans-serif', fontWeight: 400 }}>
            {user.role || 'Cargando...'}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
