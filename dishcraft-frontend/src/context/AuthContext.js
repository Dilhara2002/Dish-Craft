// src/context/AuthContext.js
import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Set auth token in axios headers
  const setupAxios = () => {
    axios.defaults.baseURL = 'http://localhost:8080/api';
    axios.interceptors.request.use(config => {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  };

  useEffect(() => {
    setupAxios();
    if (token) {
      // Fetch user details if token exists
      fetchUser();
    }
  }, [token]);

  const fetchUser = async () => {
    try {
      const response = await axios.get('/users/me');
      setUser(response.data);
    } catch (error) {
      console.error('Failed to fetch user', error);
      logout();
    }
  };

  const login = async (credentials) => {
    const response = await axios.post('/auth/login', credentials);
    const { token } = response.data;
    localStorage.setItem('token', token);
    setToken(token);
  };

  const register = async (userData) => {
    const response = await axios.post('/auth/register', userData);
    const { token } = response.data;
    localStorage.setItem('token', token);
    setToken(token);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);