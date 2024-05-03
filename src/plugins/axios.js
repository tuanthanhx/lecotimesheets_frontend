import axios from 'axios';
import router from '@/router';

axios.defaults.baseURL = import.meta.env.VITE_APP_API_URL;

axios.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('access_token');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== '/auth/refresh' &&
      originalRequest.url !== '/auth/login' &&
      originalRequest.url !== '/auth/logout'
    ) {
      originalRequest._retry = true;
      return axios
        .post(
          '/auth/refresh',
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            },
          },
        )
        .then((res) => {
          if (res.status === 200) {
            const newAccessToken = res.data.access_token;
            localStorage.setItem('access_token', newAccessToken);
            axios.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
            originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
            return axios(originalRequest);
          }
          return Promise.reject(res);
        })
        .catch((refreshError) => {
          console.error('Refresh token request failed:', refreshError);
          localStorage.removeItem('access_token');
          router.push('/login');
          return Promise.reject(refreshError);
        });
    }

    return Promise.reject(error);
  },
);

export default axios;
