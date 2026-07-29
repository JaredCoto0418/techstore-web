import axios from "axios";
import type { ApiResponse } from "../../infrastructure/interfaces/api.response";

export const paymentsApi = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "https://localhost:7066/api",
});

// Configurar interceptor para agregar token
paymentsApi.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const createPayPalOrder = async (orderId: number): Promise<ApiResponse<{ paypalOrderId: string }>> => {
    const { data } = await paymentsApi.post<ApiResponse<{ paypalOrderId: string }>>('/payments/create-order', { orderId });
    return data;
};

export const capturePayment = async (orderId: number, paypalOrderId: string): Promise<ApiResponse<object>> => {
    const { data } = await paymentsApi.post<ApiResponse<object>>('/payments/capture', { orderId, paypalOrderId });
    return data;
};
