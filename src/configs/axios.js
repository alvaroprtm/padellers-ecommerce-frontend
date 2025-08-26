import axios from 'axios';

const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  withXSRFToken: true
});

if (csrfToken) {
  api.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken;
}

// Attach token automatically
api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('token');
  if (token && !cfg.headers?.Authorization) {
    cfg.headers = { ...(cfg.headers || {}), Authorization: `Bearer ${token}` };
  }
  return cfg;
});

// Central 401 handling (optional redirect)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;