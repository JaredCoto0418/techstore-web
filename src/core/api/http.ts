import axios from "axios";
import { API_BASE_URL } from "../config";

/** Cliente HTTP autenticado: agrega el token JWT automáticamente. */
export const http = axios.create({ baseURL: API_BASE_URL });

http.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

/** Cliente HTTP para endpoints públicos (sin token). */
export const publicHttp = axios.create({ baseURL: API_BASE_URL });
