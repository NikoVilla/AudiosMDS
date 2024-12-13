import axios from 'axios';

const backendUrl = process.env.REACT_APP_BACKEND_URL;

export const getLoggedInUser = async () => {
  try {
    const token = localStorage.getItem('token');

    if (!token) {
      throw new Error('Token no encontrado. Inicia sesión nuevamente.');
    }
    if (!backendUrl) {
      throw new Error('URL del backend no definida.');
    }

    const response = await axios.get(`${backendUrl}/usuario-logueado`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.usuario;

  } catch (error) {
    if (error.response && error.response.status === 401) {
      console.error('Autenticación fallida: token inválido o expirado.');
    } else {
      console.error('Error al obtener el usuario logueado:', error);
    }
    throw error;
  }
};

// Otras funciones existentes
export const getUsers = async () => {
  try {
    const token = localStorage.getItem('token');

    if (!token) {
      throw new Error('Token no encontrado. Inicia sesión nuevamente.');
    }
    if (!backendUrl) {
      throw new Error('URL del backend no definida.');
    }

    const response = await axios.get(`${backendUrl}/usuarios`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.usuarios;

  } catch (error) {
    if (error.response && error.response.status === 401) {
      console.error('Autenticación fallida: token inválido o expirado.');
    } else {
      console.error('Error al obtener los usuarios:', error);
    }
    throw error;
  }
};

export const createUser = async (userData) => {
  try {
    const response = await axios.post(`${backendUrl}/usuarios`, userData);
    return response.data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export const deleteUser = async (id) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token no encontrado. Inicia sesión nuevamente.');
    }
    if (!backendUrl) {
      throw new Error('URL del backend no definida.');
    }

    const response = await axios.delete(`${backendUrl}/usuarios/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      console.log(`Usuario con ID ${id} eliminado correctamente.`);
    } else {
      throw new Error(`Error al eliminar el usuario con ID ${id}.`);
    }
  } catch (error) {
    console.error('Error al eliminar el usuario:', error);
  }
};

export const updateUser = async (id, userData) => {
  try {
    const token = localStorage.getItem('token');

    if (!token) {
      throw new Error('Token no encontrado. Inicia sesión nuevamente.');
    }
    if (!backendUrl) {
      throw new Error('URL del backend no definida.');
    }

    const response = await axios.put(`${backendUrl}/usuarios/${id}`, userData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

export const getUserById = async (id) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token no encontrado. Inicia sesión nuevamente.');
    }
    if (!backendUrl) {
      throw new Error('URL del backend no definida.');
    }

    const response = await axios.get(`${backendUrl}/usuarios/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.usuario;
  } catch (error) {
    console.error('Error al obtener el usuario por ID:', error);
    throw error;
  }
};