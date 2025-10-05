import axios from 'axios';
import { API_BASE_URL } from './../../config';


const api = axios.create({ baseURL: API_BASE_URL });

// أضف lang كـ query param و header Accept-Language
api.interceptors.request.use(config => {
  const lang = localStorage.getItem('lang') || 'ar';
  if (!config.params) config.params = {};
  config.params.lang = lang;
  config.headers = { ...(config.headers || {}), 'Accept-Language': lang };
  return config;
}, err => Promise.reject(err));

export default api;
