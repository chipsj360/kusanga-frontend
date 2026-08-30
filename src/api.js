import axios from "axios";

// Remove trailing slashes to prevent malformed or duplicate URLs.
// Production "/" becomes an empty origin, which makes requests same-origin.
// Development can use http://127.0.0.1:8000.
const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || ""
).replace(/\/+$/, "");

const API = axios.create({
  baseURL: API_BASE_URL || undefined,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach the access token to authenticated requests.
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Refresh an expired access token once.
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const requestUrl = originalRequest?.url || "";

    const isLoginRequest = requestUrl.includes("/api/auth/login/");
    const isRefreshRequest = requestUrl.includes("/api/auth/refresh/");

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !isLoginRequest &&
      !isRefreshRequest
    ) {
      originalRequest._retry = true;

      const refresh = localStorage.getItem("refresh");

      if (!refresh) {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        window.location.replace("/login");

        return Promise.reject(error);
      }

      try {
        const refreshUrl = `${API_BASE_URL}/api/auth/refresh/`;

        const response = await axios.post(refreshUrl, {
          refresh,
        });

        const newAccessToken = response.data.access;

        localStorage.setItem("access", newAccessToken);

        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return API(originalRequest);
      } catch (refreshError) {
        console.error(
          "Refresh token failed:",
          refreshError.response?.data || refreshError.message
        );

        localStorage.removeItem("access");
        localStorage.removeItem("refresh");

        window.location.replace("/login");

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default API;