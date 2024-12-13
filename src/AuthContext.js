import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getLoggedInUser } from './../src/screens/users/ServiceUser';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      fetchUserRole();
    }
  }, []);

  const fetchUserRole = async () => {
    try {
      const user = await getLoggedInUser();
      setUserRole(user.role);
    } catch (error) {
      console.error('Error al obtener el rol del usuario:', error);
    }
  };

  const login = async () => {
    setIsAuthenticated(true);

    try {
      const user = await getLoggedInUser();
      setUserRole(user.role);

      // Redireccionar según el rol del usuario
      if (user.role.includes('Taquilla')) {
        navigate('/audios');
      } else {
        navigate('/marketing');
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      setIsAuthenticated(false);
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userRole, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
