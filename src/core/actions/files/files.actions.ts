import { AxiosError } from 'axios';
import { uploadProductImage, deleteProductImage } from '../../api/files.api';
import type { ApiResponse } from '../../../infrastructure/interfaces/api.response';
import type { ApiErrorResponse } from '../../../infrastructure/interfaces/api-error.response';

export const uploadProductImageAction = async (productId: number, file: File): Promise<ApiResponse<any>> => {
    try {
        return await uploadProductImage(productId, file);
    } catch (error) {
        const apiError = error as AxiosError<ApiErrorResponse>;
        return {
            status: false,
            message: apiError.response?.data?.message || "Error al subir la imagen",
        };
    }
};

export const deleteProductImageAction = async (imageUrl: string): Promise<ApiResponse<object>> => {
    try {
        return await deleteProductImage(imageUrl);
    } catch (error) {
        const apiError = error as AxiosError<ApiErrorResponse>;
        return {
            status: false,
            message: apiError.response?.data?.message || "Error al eliminar la imagen",
        };
    }
}; 