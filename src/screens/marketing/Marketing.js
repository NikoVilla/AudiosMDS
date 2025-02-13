import React from 'react';
import { Box } from '@mui/material';
import Sidebar from '../../shared/sidebar';
import Header from '../../shared/Header';
import Content from './Content';
import ViewMarketing from './ViewMarketing'
import { useState} from 'react';

export default function Marketing() {
  const [activeItem, setActiveItem] = useState('');
  const [open, setOpen] = useState(false);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const handleListItemClick = (item) => {
    setActiveItem(item);
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
          <ViewMarketing />
        </Box>
      </Box>
    </Box>
  );
}
