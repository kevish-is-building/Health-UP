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

// Log a meal
export const logMeal = async (mealData) => {
  try {
    const response = await axiosInstance.post('/nutrition', mealData, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get meal logs with optional pagination and filtering
export const getMealLogs = async ({ page = 1, limit = 10, date, mealType } = {}) => {
  try {
    const params = { page, limit };
    if (date) params.date = date;
    if (mealType) params.mealType = mealType;
    
    const response = await axiosInstance.get('/nutrition', { 
      params,
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get specific meal log
export const getMealLog = async (id) => {
  try {
    const response = await axiosInstance.get(`/nutrition/${id}`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update meal log
export const updateMealLog = async (id, mealData) => {
  try {
    const response = await axiosInstance.put(`/nutrition/${id}`, mealData, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Delete meal log
export const deleteMealLog = async (id) => {
  try {
    const response = await axiosInstance.delete(`/nutrition/${id}`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get daily nutrition summary
export const getDailySummary = async (date = new Date().toISOString().split('T')[0]) => {
  try {
    const response = await axiosInstance.get('/nutrition/daily-summary', {
      params: { date },
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get nutrition statistics
export const getNutritionStats = async (days = 7) => {
  try {
    const response = await axiosInstance.get('/nutrition/stats', {
      params: { days },
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get quick meal presets
export const getPresets = async () => {
  try {
    const response = await axiosInstance.get('/nutrition/presets', {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Quick add predefined meals
export const quickAddMeal = async (presetData) => {
  try {
    const response = await axiosInstance.post('/nutrition/quick-add', presetData, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default {
  logMeal,
  getMealLogs,
  getMealLog,
  updateMealLog,
  deleteMealLog,
  getDailySummary,
  getNutritionStats,
  getPresets,
  quickAddMeal,
};