import axios from "axios";
import type { ApiResponse } from "../../infrastructure/interfaces/api.response";
import type { TransactionResponse } from "../../infrastructure/interfaces/transaction.response";

export const transactionsApi = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "https://localhost:7066/api",
});

// Configurar interceptor para agregar token
transactionsApi.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const getMyTransactions = async (): Promise<ApiResponse<TransactionResponse[]>> => {
    const { data } = await transactionsApi.get<ApiResponse<TransactionResponse[]>>('/transactions/my-transactions');
    return data;
};

export const getAllTransactions = async (): Promise<ApiResponse<TransactionResponse[]>> => {
    const { data } = await transactionsApi.get<ApiResponse<TransactionResponse[]>>('/transactions');
    return data;
};
