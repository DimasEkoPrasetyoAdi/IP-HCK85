import { createContext, useContext, useState, useEffect } from 'react';
import http from '../lib/http';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication on app load
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const userName = localStorage.getItem('user_name');
      
      if (!token) {
        setIsAuthenticated(false);
        setUser(null);
        setIsLoading(false);
        return;
      }

      // Set user data if available
      if (userName) {
        setUser({ name: userName });
      }
      
      setIsAuthenticated(true);
      
      // Optional: Verify token with backend
      // const response = await http.get('/profile', {
      //   headers: { Authorization: `Bearer ${token}` }
      // });
      // setUser(response.data.user);
      
    } catch (error) {
      console.error('Auth check failed:', error);
      logout(); // Clear invalid token
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      const response = await http.post('/login', credentials);
      const { access_token, user: userData } = response.data;
      
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('user_name', userData?.name || 'User');
      
      setUser(userData);
      setIsAuthenticated(true);
      
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const googleLogin = async (credential) => {
    try {
      const response = await http.post('/google-login', {}, {
        headers: { id_token: credential }
      });
      
      const { access_token, user: userData } = response.data;
      
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('user_name', userData?.name || 'User');
      
      setUser(userData);
      setIsAuthenticated(true);
      
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Google login failed' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_name');
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    googleLogin,
    logout,
    checkAuth
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
