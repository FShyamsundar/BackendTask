import axios from "axios";

const defaultApiBaseUrl = "https://backendtask-3czi.onrender.com/api/v1";
const configuredApiBaseUrl =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/+$/, "") || defaultApiBaseUrl;

const api = axios.create({
  baseURL: configuredApiBaseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
