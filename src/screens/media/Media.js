import React from 'react';
import { Box } from '@mui/material';
import Sidebar from '../../shared/sidebar';
import Header from '../../shared/Header';
import Content from './Content';
import ViewMedia from './ViewMedia';
import { useState } from 'react';
// import { useLocation } from 'react-router-dom';

export default function Media() {
  // const location = useLocation();
  const [open, setOpen] = useState(false); 
  const [activeItem, setActiveItem] = useState('');

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const handleListItemClick = (text) => {
    setActiveItem(text);
    setOpen(true);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#000000', color: 'white', overflow: 'hidden' }}>
      <Box sx={{ flexShrink: 0 }}>
        <Header toggleDrawer={toggleDrawer} />
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'row', flex: 1, overflow: 'hidden' }}>
        <Sidebar open={open} toggleDrawer={toggleDrawer} handleListItemClick={handleListItemClick} activeItem={activeItem} />
        <Box sx={{ width: { xs: '47%', sm: '30%' }, ml: 2, mt: 2, mr: 2, mb: 1, overflow: 'hidden' }}> 
          <Content />
        </Box>
        <Box sx={{ width: { xs: '53%', sm: '69%' }, mr: 3, mt: 2, mb: 1, overflow: 'hidden', height: '83vh' }}> 
          <ViewMedia />
        </Box>
      </Box>
    </Box>
  );
}