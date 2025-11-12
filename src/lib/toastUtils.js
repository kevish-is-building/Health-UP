import { toast } from 'sonner';

// Common toast notification utilities
export const toastUtils = {
  // Success toasts
  success: {
    login: () => toast.success('Welcome back!', {
      description: 'You have been successfully logged in.'
    }),
    logout: () => toast.success('Logged Out', {
      description: 'You have been successfully logged out. See you next time!'
    }),
    signup: () => toast.success('Account Created!', {
      description: 'Welcome to Health-UP! Your account has been created successfully.'
    }),
    workoutSaved: () => toast.success('Workout Saved!', {
      description: 'Your workout has been saved successfully.'
    }),
    mealLogged: () => toast.success('Meal Logged!', {
      description: 'Your meal has been added to your nutrition tracker.'
    }),
    profileUpdated: () => toast.success('Profile Updated!', {
      description: 'Your profile information has been updated successfully.'
    }),
    goalAchieved: () => toast.success('Goal Achieved! 🎉', {
      description: 'Congratulations on reaching your fitness goal!'
    }),
  },

  // Error toasts
  error: {
    loginFailed: (message) => toast.error('Login Failed', {
      description: message || 'Please check your credentials and try again.'
    }),
    signupFailed: (message) => toast.error('Registration Failed', {
      description: message || 'Unable to create account. Please try again.'
    }),
    logoutFailed: () => toast.error('Logout Failed', {
      description: 'There was an error logging you out. Please try again.'
    }),
    networkError: () => toast.error('Network Error', {
      description: 'Unable to connect to the server. Please check your internet connection.'
    }),
    validationError: (message) => toast.error('Validation Error', {
      description: message
    }),
    saveFailed: (item) => toast.error(`Failed to Save ${item}`, {
      description: 'Something went wrong while saving. Please try again.'
    }),
    loadFailed: (item) => toast.error(`Failed to Load ${item}`, {
      description: 'Unable to load data. Please refresh the page.'
    }),
  },

  // Info toasts
  info: {
    authRequired: () => toast.info('Authentication Required', {
      description: 'Please log in to access this page.'
    }),
    comingSoon: () => toast.info('Coming Soon!', {
      description: 'This feature is currently being developed.'
    }),
    maintenance: () => toast.info('Maintenance Mode', {
      description: 'Some features may be temporarily unavailable.'
    }),
  },

  // Warning toasts
  warning: {
    unsavedChanges: () => toast.warning('Unsaved Changes', {
      description: 'You have unsaved changes. Are you sure you want to leave?'
    }),
    lowStreak: () => toast.warning('Streak Alert!', {
      description: 'Your workout streak is about to break. Keep it up!'
    }),
    goalDeadline: () => toast.warning('Goal Deadline Approaching', {
      description: 'You have less than a week to reach your fitness goal.'
    }),
  },

  // Custom toast with options
  custom: (type, title, description, options = {}) => {
    return toast[type](title, {
      description,
      ...options
    });
  }
};

// Promise-based toast for async operations
export const toastPromise = (promise, messages) => {
  return toast.promise(promise, {
    loading: messages.loading || 'Loading...',
    success: (data) => ({
      title: messages.success.title || 'Success!',
      description: messages.success.description || 'Operation completed successfully.'
    }),
    error: (err) => ({
      title: messages.error.title || 'Error!',
      description: messages.error.description || 'Something went wrong.'
    })
  });
};

export default toastUtils;