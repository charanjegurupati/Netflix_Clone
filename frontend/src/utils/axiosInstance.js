import axios from 'axios';

const API_URL = 'https://netflix-clone-xgi0.onrender.com';

const axiosInstance = axios.create({
  baseURL: API_URL,
});

export default axiosInstance;
