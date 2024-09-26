import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null); // Guardar el token JWT

  // Cargar el usuario y token almacenados en localStorage al montar el componente
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken); // Guardar el token en el estado
    }
  }, []);

  const login = async (username, password) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to log in.');
      }

      const userData = await res.json(); // Obtenemos los datos del usuario, incluyendo el token
      setUser(userData);
      setToken(userData.token); // Guardamos el token en el estado
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', userData.token); // Guardamos el token en localStorage

      return userData;
    } catch (error) {
      console.error('Error during login:', error.message || error);
      throw new Error('An error occurred during login. Please try again.');
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null); // Borrar el token del estado
    localStorage.removeItem('user');
    localStorage.removeItem('token'); // Borrar el token del localStorage
  };

  // Función para obtener el token
  const getToken = () => {
    return token;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, getToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
