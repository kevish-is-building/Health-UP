import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance from '../lib/axios';

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
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          setIsAuthenticated(true);
          
          // Optional: Verify with backend (if endpoint exists)
          try {
            const response = await axiosInstance.get('/auth/verify');
            if (response.data.success) {
              setUser(response.data.user);
            } else {
              // Token invalid, clear local storage
              localStorage.removeItem('user');
              setUser(null);
              setIsAuthenticated(false);
            }
          } catch (verifyError) {
            // Verify endpoint might not exist yet, just use stored user
            console.log('Auth verification endpoint not available');
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('user');
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials) => {
    try {
      const response = await axiosInstance.post('/auth/login', credentials);
      console.log('Login response:', response); // Debug log
      
      // Handle different response formats - if we get a 200 response, consider it success
      if (response.status === 200 || response.status === 201) {
        const userData = response.data.user || response.data;
        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem('user', JSON.stringify(userData));
        return { success: true, user: userData };
      } else {
        const errorMessage = response.data?.message || 'Login failed';
        return { success: false, error: errorMessage };
      }
    } catch (error) {
      console.log('Login error:', error); // Debug log
      const errorMessage = error.response?.data?.message || 'Login failed';
      return { success: false, error: errorMessage };
    }
  };

  const register = async (userData) => {
    try {
      const response = await axiosInstance.post('/auth/register', userData);
      console.log('Register response:', response); // Debug log
      
      // Handle different response formats - if we get a 200/201 response, consider it success
      if (response.status === 200 || response.status === 201) {
        const newUser = response.data.user || response.data;
        setUser(newUser);
        setIsAuthenticated(true);
        localStorage.setItem('user', JSON.stringify(newUser));
        return { success: true, user: newUser };
      } else {
        const errorMessage = response.data?.message || 'Registration failed';
        return { success: false, error: errorMessage };
      }
    } catch (error) {
      console.log('Register error:', error); // Debug log
      const errorMessage = error.response?.data?.message || 'Registration failed';
      return { success: false, error: errorMessage };
    }
  };

  const googleLogin = async (credentialResponse) => {
    try {
      console.log("---->>>>>.", credentialResponse)
      const response = await axiosInstance.post('/auth/google', {
        token: credentialResponse.credential
      });
      console.log('Google login response:', response); // Debug log
      
      if (response.status === 200 || response.status === 201) {
        const userData = response.data.user || response.data;
        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem('user', JSON.stringify(userData));
        return { success: true, user: userData };
      } else {
        const errorMessage = response.data?.message || 'Google login failed';
        return { success: false, error: errorMessage };
      }
    } catch (error) {
      console.log('Google login error:', error); // Debug log
      const errorMessage = error.response?.data?.message || 'Google login failed';
      return { success: false, error: errorMessage };
    }
  };

  const logout = async () => {
    try {
      await axiosInstance.post('/auth/logout');
    } catch (error) {
      console.error('Logout request failed:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('user');
    }
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    updateUser,
    googleLogin
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;