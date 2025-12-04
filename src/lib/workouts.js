import axiosInstance from './axios';

// Helper to get auth headers (fallback if interceptor doesn't work)
const getAuthHeaders = () => {
  const user = localStorage.getItem('user');
  if (user) {
    try {
      const userData = JSON.parse(user);
      const token = userData.accessToken || userData.token;
      if (token) {
        return { Authorization: `Bearer ${token}` };
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
    }
  }
  return {};
};

export const getWorkouts = async ({ page = 1, limit = 12, difficulty, bodyPart, query } = {}) => {
  try {
    const params = { page, limit };
    if (difficulty) params.difficulty = difficulty;
    if (bodyPart) params.bodyPart = bodyPart;
    if (query) params.query = query;

    const res = await axiosInstance.get('/workouts', { 
      params,
      headers: getAuthHeaders()
    });
    return res.data;
  } catch (err) {
    throw err;
  }
};

export const createWorkout = async (payload) => {
  try {
    const res = await axiosInstance.post('/workouts', payload, {
      headers: getAuthHeaders()
    });
    return res.data;
  } catch (err) {
    throw err;
  }
};

export default {
  getWorkouts,
  createWorkout,
};
