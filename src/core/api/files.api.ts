import axios from "axios";
import type { ApiResponse } from '../../infrastructure/interfaces/api.response';

export const filesApi = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "https://localhost:7066/api",
});

// Configurar interceptor para agregar token
filesApi.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export interface FileUploadResponse {
    message: string;
    imageUrl: string;
}

export const uploadProductImage = async (productId: number, file: File): Promise<ApiResponse<FileUploadResponse>> => {
    const formData = new FormData();
    formData.append('file', file);
    
    const { data } = await filesApi.post<ApiResponse<FileUploadResponse>>(`/files/upload-product-image/${productId}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return data;
};

export const deleteProductImage = async (imageUrl: string): Promise<ApiResponse<object>> => {
    const { data } = await filesApi.delete<ApiResponse<object>>(`/files/delete-product-image?imageUrl=${encodeURIComponent(imageUrl)}`);
    return data;
}; 