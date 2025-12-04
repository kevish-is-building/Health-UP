import axios from "axios";

export const axiosInstance = axios.create({
  baseURL:
    import.meta.env.VITE_MODE === "production"
      ? `${import.meta.env.VITE_BACKEND_URL}/api/v1`
      : "http://localhost:8080/api/v1",
  withCredentials: true,
});

// Add request interceptor to include Bearer token
axiosInstance.interceptors.request.use(
  (config) => {
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const userData = JSON.parse(user);
        const token = userData.accessToken || userData.token;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token expiration
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, clear storage and redirect to login
      localStorage.removeItem('user');
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;