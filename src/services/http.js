import axios from "axios";

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000",
  timeout: 15000,
});

// Ejemplo: adjuntar token si existe
http.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Ejemplo: manejo simple de errores
http.interceptors.response.use(
  (res) => res,
  (err) => {
    // Aquí podrías normalizar errores, redirigir al login, etc.
    return Promise.reject(err);
  }
);