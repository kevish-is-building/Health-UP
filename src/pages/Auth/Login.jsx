import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { toastUtils } from '../../lib/toastUtils';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const navigate = useNavigate();
  const { login, googleLogin } = useAuth();

  useEffect(() => {
    // Initialize Google Sign-In
    const initializeGoogleSignIn = () => {
      if (window.google && import.meta.env.VITE_GOOGLE_CLIENT_ID) {
        try {
          window.google.accounts.id.initialize({
            client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
            callback: handleGoogleLogin,
            auto_select: false,
            cancel_on_tap_outside: true,
          });
          
          // Render the Google Sign-In button
          const buttonElement = document.getElementById("google-signin-button");
          if (buttonElement) {
            window.google.accounts.id.renderButton(buttonElement, {
              theme: "outline",
              size: "large",
              width: "100%",
              text: "signin_with",
              shape: "rectangular",
            });
          }
        } catch (error) {
          console.error('Error initializing Google Sign-In:', error);
          // Show fallback button
          const fallbackButton = document.getElementById("fallback-google-button");
          if (fallbackButton) {
            fallbackButton.style.display = 'block';
          }
        }
      } else {
        console.warn('Google Sign-In not available or Client ID not configured');
        // Show fallback button
        const fallbackButton = document.getElementById("fallback-google-button");
        if (fallbackButton) {
          fallbackButton.style.display = 'block';
        }
      }
    };

    // Try to initialize immediately if Google is available
    if (window.google) {
      initializeGoogleSignIn();
    } else {
      // Wait for Google script to load
      const checkForGoogle = setInterval(() => {
        if (window.google) {
          clearInterval(checkForGoogle);
          initializeGoogleSignIn();
        }
      }, 100);

      // Clean up interval after 5 seconds
      setTimeout(() => {
        clearInterval(checkForGoogle);
        // Show fallback if Google still not available
        const fallbackButton = document.getElementById("fallback-google-button");
        if (fallbackButton && !window.google) {
          fallbackButton.style.display = 'block';
        }
      }, 5000);
    }
  }, []);

  const handleGoogleLogin = async (response) => {
    setIsGoogleLoading(true);
    try {
      const result = await googleLogin(response);
      
      if (result.success) {
        toastUtils.success.login();
        navigate('/profile');
      } else {
        toastUtils.error.loginFailed(result.error);
      }
    } catch (err) {
      console.log('Google login error:', err);
      toastUtils.error.loginFailed('Google login failed');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await login({
        email: formData.email,
        password: formData.password
      });

      console.log('Login result:', result); // Debug log

      if (result.success) {
        toastUtils.success.login();
        // Redirect to dashboard or landing page
        navigate('/profile');
      } else {
        console.log('Login failed:', result.error); // Debug log
        toastUtils.error.loginFailed(result.error);
      }
    } catch (err) {
      console.log('Login error:', err); // Debug log
      toastUtils.error.loginFailed();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email Address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={formData.email}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200"
          placeholder="Enter your email"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          value={formData.password}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200"
          placeholder="Enter your password"
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            id="remember-me"
            name="remember-me"
            type="checkbox"
            className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
          />
          <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
            Remember me
          </label>
        </div>

        <div className="text-sm">
          <button
            type="button"
            className="font-medium text-emerald-600 hover:text-emerald-500 transition-colors duration-200"
          >
            Forgot your password?
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
      >
        {isLoading ? (
          <div className="flex items-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Signing in...
          </div>
        ) : (
          'Sign in'
        )}
      </button>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>

        <div className="mt-6">
          <div id="google-signin-button" className="w-full"></div>
          
          {/* Fallback button in case Google button doesn't render */}
          <div className="mt-4" style={{display: 'none'}} id="fallback-google-button">
            <button
              type="button"
              disabled={isGoogleLoading}
              className="w-full inline-flex justify-center items-center py-2.5 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {isGoogleLoading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </div>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Google Sign-In unavailable
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default Login;