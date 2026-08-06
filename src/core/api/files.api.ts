import { http } from "./http";
import type { ApiResponse } from '../../infrastructure/interfaces/api.response';

export interface FileUploadResponse {
    message: string;
    imageUrl: string;
}

export const uploadProductImage = async (productId: number, file: File): Promise<ApiResponse<FileUploadResponse>> => {
    const formData = new FormData();
    formData.append('file', file);
    
    const { data } = await http.post<ApiResponse<FileUploadResponse>>(`/file/upload-product-image/${productId}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return data;
};

export const deleteProductImage = async (imageUrl: string): Promise<ApiResponse<object>> => {
    const { data } = await http.delete<ApiResponse<object>>(`/file/delete-product-image?imageUrl=${encodeURIComponent(imageUrl)}`);
    return data;
}; 