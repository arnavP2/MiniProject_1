import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Pointing to the backend
  withCredentials: true, // Crucial for sending/receiving cookies
});

export default api;
