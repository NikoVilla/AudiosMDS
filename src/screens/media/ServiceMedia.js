import axios from 'axios';

const backendUrl = process.env.REACT_APP_BACKEND_URL;

export const uploadMedia = async (formData) => {
  try {
    const token = localStorage.getItem('token');

    if (!token) {
      throw new Error('Token no encontrado. Por favor, inicia sesión nuevamente.');
    }

    if (!backendUrl) {
      throw new Error('URL del backend no definida en las variables de entorno.');
    }

    const response = await axios.post(`${backendUrl}/upload-media`, formData, {
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

export const getMedia = async () => {
  try {
    const token = localStorage.getItem('token');

    if (!token) {
      throw new Error('Token no encontrado. Inicia sesión nuevamente.');
    }
    if (!backendUrl) {
      throw new Error('URL del backend no definida.');
    }

    const response = await axios.get(`${backendUrl}/media`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching media:', error);
    throw error;
  }
};

export const deleteMedia = async (filename) => {
  try {
    const token = localStorage.getItem('token');

    if (!token) {
      throw new Error('Token no encontrado. Inicia sesión nuevamente.');
    }
    if (!backendUrl) {
      throw new Error('URL del backend no definida.');
    }

    const response = await axios.delete(`${backendUrl}/media/${filename}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error deleting media:', error);
    throw error;
  }
};