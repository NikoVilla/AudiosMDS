import React, { useEffect, useState } from 'react';
import axios from 'axios';

const FullScreenPlayer = () => {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchCurrentMessage = () => {
      axios.get('http://localhost:3001/current-track')
        .then((response) => {
          const data = response.data;
          console.log('Current message from server:', data);

          if (data) {
            setMessage(data.message || 'No message found');
            console.log('Message set:', data.message);
          } else {
            console.log('No data found on server');
          }
        })
        .catch((error) => {
          console.error('Error fetching current message', error);
        });
    };

    fetchCurrentMessage();

    // Poll the server periodically to check for updates
    const intervalId = setInterval(fetchCurrentMessage, 3000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      width: '100%', 
      height: '100%', 
      backgroundColor: 'black', 
      zIndex: 9999 
    }}>
      <p style={{ color: 'white', textAlign: 'center', marginTop: '20%' }}>{message}</p>
    </div>
  );
};

export default FullScreenPlayer;
