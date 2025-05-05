import axios from 'axios';

// Create an axios instance with default configuration
const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080', // Your backend server URL
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // If you need to handle cookies
});

// Request interceptor - modify requests before they are sent
axiosInstance.interceptors.request.use(
  (config) => {
    // You can add auth tokens here if needed
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle responses globally
axiosInstance.interceptors.response.use(
  (response) => {
    // Any status code within 2xx will trigger this
    return response;
  },
  (error) => {
    // Any status codes outside 2xx will trigger this
    const { response } = error;
    
    if (response) {
      // Handle different error statuses
      switch (response.status) {
        case 401:
          // Handle unauthorized access
          console.error('Unauthorized access - please login');
          break;
        case 403:
          // Handle forbidden access
          console.error('Forbidden access');
          break;
        case 404:
          // Handle not found errors
          console.error('Resource not found');
          break;
        case 500:
          // Handle server errors
          console.error('Server error occurred');
          break;
        default:
          console.error('An error occurred');
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received from server');
    } else {
      // Something happened in setting up the request
      console.error('Error setting up request');
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;