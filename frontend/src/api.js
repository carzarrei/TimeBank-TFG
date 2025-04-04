import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:4000', // Cambia esto a la URL de tu backend si es necesario
});

export default api;