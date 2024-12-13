import * as React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ChevronRight from '@mui/icons-material/ChevronRight';
import PermMedia from '@mui/icons-material/PermMedia';
import AudioFile from '@mui/icons-material/AudioFile';
import GroupIcon from '@mui/icons-material/Group';
// import DataThresholdingOutlinedIcon from '@mui/icons-material/DataThresholdingOutlined';
import AspectRatioIcon from '@mui/icons-material/AspectRatio';
import { getLoggedInUser } from './../screens/users/ServiceUser';

export default function Sidebar({ open, toggleDrawer }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (text, path) => {
    toggleDrawer(false);
    navigate(path);
  };

  const handleLogout = () => {
    navigate('/');
  };

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

  // Función para verificar los roles y renderizar los botones correspondientes
  const getNavigationItems = () => {
    const roles = user.role;
    const items = [
      // { text: 'Slot', icon: <PermMedia />, path: '/media', roles: ['Administrador', 'Slot'] },
      { text: 'Audios', icon: <AudioFile />, path: '/audios', roles: ['Administrador', 'Taquilla', 'Marketing'] },
      { text: 'Usuarios', icon: <GroupIcon />, path: '/usuarios', roles: ['Administrador'] },
      { text: 'Slot', icon: <PermMedia />, path: '/marketing', roles: ['Administrador', 'Slot'] }
    ];

    return items.filter(item => item.roles.some(role => roles.includes(role) || roles.includes('Administrador')));
  };

  const DrawerList = (
    <Box sx={{ width: '100%', backgroundColor: '#131313', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }} role="presentation">
      <Box>
        <Box sx={{ padding: 1, color: 'white', textAlign: 'right' }}>
          <Box 
            sx={{ 
              cursor: 'pointer', 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'flex-end' 
            }} 
            onClick={toggleDrawer(false)} 
          >
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
            
            {/* Icono y Cargo */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1, marginTop: 0.5,  width: '100%'}}>
              <ChevronRight sx={{ color: 'white'}} />
              <Typography sx={{ color: '#FFA800', fontSize: { xs: 16, sm: 16 }, fontFamily: 'Nunito, sans-serif', fontWeight: 400 }}>
                {user.role || 'Cargando...'}
              </Typography>
            </Box>
          </Box>
        </Box>
        <Divider sx={{ borderColor: 'orange' }} />
        <List>
          {getNavigationItems().map(({ text, icon, path }) => (
            <ListItem key={text} disablePadding>
              <ListItemButton
                onClick={() => handleNavigation(text, path)}
                sx={{
                  borderRadius: 15,
                  backgroundColor: location.pathname === path ? '#000000' : '#131313',
                  '&:hover': {
                    backgroundColor: '#000000',
                    color: '#FFA800',
                  },
                }}
              >
                <ListItemIcon sx={{ color: location.pathname === path ? '#FFA800' : 'white' }}>
                  {icon}
                </ListItemIcon>
                <ListItemText primary={text} sx={{ color: location.pathname === path ? '#FFA800' : 'white', mr: 2 }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider sx={{ borderColor: 'orange' }} />
        <ListItem>
          <ListItemText primary="Pantallas Completas" sx={{ color: 'white' }} />
        </ListItem>
        {[
          { text: 'Audios Fullscreen', icon: <AspectRatioIcon />, path: '/audios/sala', roles: ['Administrador', 'Taquilla', 'Slot'] },
          // { text: 'Media Fullscreen', icon: <AspectRatioIcon />, path: '/media/sala', roles: ['Administrador', 'Slot'] }
        ].filter(item => item.roles.some(role => user.role.includes(role) || user.role === 'Administrador')).map(({ text, icon, path }) => (
          <ListItem key={text} disablePadding>
            <ListItemButton
              onClick={() => handleNavigation(text, path)}
              sx={{
                borderRadius: 15,
                backgroundColor: location.pathname === path ? '#000000' : '#131313',
                '&:hover': {
                  backgroundColor: '#000000',
                },
              }}
            >
              <ListItemIcon sx={{ color: location.pathname === path ? '#FFA800' : 'white' }}>
                {icon}
              </ListItemIcon>
              <ListItemText primary={text} sx={{ color: location.pathname === path ? '#FFA800' : 'white', mr: 2 }} />
            </ListItemButton>
          </ListItem>
        ))}
      </Box>
      <Button 
        onClick={handleLogout}
        variant="contained"
        color='error'
        sx={{
          mb: 3,
          mt: 3,
          borderRadius: 3,
          width: '80%',
          textTransform: 'none',
          alignSelf: 'center',
          '&:hover': {
            backgroundColor: '#333333',
          },
        }}
      >
        Cerrar sesión
      </Button>
    </Box>
  );

  return (
    <Drawer 
      open={open} 
      onClose={toggleDrawer(false)} 
      anchor="right"
      variant="persistent" 
      sx={{
        '& .MuiDrawer-paper': {
          backgroundColor: '#131313',
          boxShadow: 'none',
          border: 'none',     
        },
      }}
    >
      {DrawerList}
    </Drawer>
  );
}
