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

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to log in.');
      }

      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('token', data.token);

      return data.user;
    } catch (error) {
      console.error('Error during login:', error.message);
      throw error;
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
