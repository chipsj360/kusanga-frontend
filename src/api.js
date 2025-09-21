// src/api.js
import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000", // Django backend
});

// Request interceptor to attach token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle 401 and refresh token
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const refresh = localStorage.getItem("refresh");
        if (!refresh) {
          // No refresh token → logout
          localStorage.removeItem("access");
          localStorage.removeItem("refresh");
          window.location.href = "/login";
          return Promise.reject(error);
        }

        const res = await axios.post("http://127.0.0.1:8000/api/auth/refresh/", {
          refresh,
        });

        localStorage.setItem("access", res.data.access);
        originalRequest.headers.Authorization = `Bearer ${res.data.access}`;

        return API(originalRequest); // retry original request
      } catch (refreshError) {
        console.error("Refresh token expired", refreshError);
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);
export default API;
