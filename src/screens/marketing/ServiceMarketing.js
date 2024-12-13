import axios from 'axios';

const backendUrl = process.env.REACT_APP_BACKEND_URL;

export const uploadMarketing = async (formData) => {
  try {
    // Obtén el token almacenado localmente
    const token = localStorage.getItem('token');

    if (!token) {
      throw new Error('Token no encontrado. Por favor, inicia sesión nuevamente.');
    }

    if (!backendUrl) {
      throw new Error('URL del backend no definida en las variables de entorno.');
    }

    // Realiza la solicitud POST al backend
    const response = await axios.post(`${backendUrl}/upload-publicidad`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // Indica que el cuerpo es FormData
        Authorization: `Bearer ${token}`, // Token de autorización
      },
    });

    // Devuelve la respuesta del servidor
    return response.data;
  } catch (error) {
    console.error('Error al subir medios:', error);

    // Manejo de errores para obtener mensajes útiles
    const errorMessage = 
      error.response?.data?.message || // Mensaje proporcionado por el backend
      error.message ||                 // Mensaje del propio error
      'Error desconocido al subir los medios'; // Fallback

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
