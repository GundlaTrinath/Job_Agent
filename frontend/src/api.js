import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const sendMessage = async (message, context = {}) => {
  const response = await api.post('/chat', { message, context });
  return response.data;
};

export default api;
