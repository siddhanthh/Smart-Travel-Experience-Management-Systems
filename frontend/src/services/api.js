import axios from 'axios';

// Backend base URL. JWT is stored as an httpOnly cookie by the server,
// so we don't attach an Authorization header — withCredentials sends the cookie.
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Central error handling: normalize error message shape so components
// can just do `catch(err) { setError(err.message) }`
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.error ||
      error.response?.data?.message ||
      error.message ||
      'Something went wrong';
    return Promise.reject({ ...error, message });
  }
);

export default api;
