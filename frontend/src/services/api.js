import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (username, email, password) =>
    api.post('/auth/register/', { username, email, password }),
  login: (username, password) =>
    api.post('/auth/login/', { username, password }),
};

export const roomAPI = {
  getRooms: () => api.get('/auth/rooms/'),
  getRoom: (id) => api.get(`/auth/rooms/${id}/`),
  createRoom: (name) => api.post('/auth/rooms/', { name }),
  getMessages: (roomId) => api.get(`/auth/rooms/${roomId}/messages/`),
};

export default api;
