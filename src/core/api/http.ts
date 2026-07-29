import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "https://localhost:7066/api";

/** Cliente HTTP autenticado: agrega el token JWT automáticamente. */
export const http = axios.create({ baseURL });

http.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

/** Cliente HTTP para endpoints públicos (sin token). */
export const publicHttp = axios.create({ baseURL });
