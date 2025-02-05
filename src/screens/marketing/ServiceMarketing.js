import axios from 'axios';

const backendUrl = process.env.REACT_APP_BACKEND_URL;

export const uploadMarketing = async (formData) => {
  try {
    const token = localStorage.getItem('token');

    if (!token) {
      throw new Error('Token no encontrado. Por favor, inicia sesión nuevamente.');
    }

    if (!backendUrl) {
      throw new Error('URL del backend no definida en las variables de entorno.');
    }

    const response = await axios.post(`${backendUrl}/upload-publicidad`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error al subir medios:', error);

    const errorMessage = 
      error.response?.data?.message ||
      error.message ||               
      'Error desconocido al subir los medios';

    throw new Error(errorMessage);
  }
};

export const getMarketing = async () => {
  try {
    const token = localStorage.getItem('token');

    if (!token) {
      throw new Error('Token no encontrado. Inicia sesión nuevamente.');
    }
    if (!backendUrl) {
      throw new Error('URL del backend no definida.');
    }

    const response = await axios.get(`${backendUrl}/marketing`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching publicidad:', error);
    throw error;
  }
};

// ################################ Fijo/Mostrar ahora #####################################

export const setImageTime = async (imageName, fijo) => {
  const response = await fetch(`${backendUrl}/set-time`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ imageName, fijo }),
  });
  if (!response.ok) {
    throw new Error('Failed to set image time');
  }
  return await response.json();
};

export const deleteMarketing = async (filename) => {
  try {
    const token = localStorage.getItem('token');

    if (!token) {
      throw new Error('Token no encontrado. Inicia sesión nuevamente.');
    }
    if (!backendUrl) {
      throw new Error('URL del backend no definida.');
    }

    const response = await axios.delete(`${backendUrl}/marketing/${filename}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error deleting publicidad:', error);
    throw error;
  }
};
