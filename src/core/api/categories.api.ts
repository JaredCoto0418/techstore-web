import { http, publicHttp } from "./http";
import type { ApiResponse } from "../../infrastructure/interfaces/api.response";
import type { CategoryResponse } from "../../infrastructure/interfaces/category.response";
import type { CategoryCreateModel, CategoryEditModel } from "../models/category.model";

export const getCategories = async (searchTerm = "", page = 1, pageSize = 0): Promise<ApiResponse<CategoryResponse[]>> => {
    const { data } = await http.get<ApiResponse<CategoryResponse[]>>('/categories', {
        params: { searchTerm, page, pageSize }
    });
    return data;
};

export const getProductCategories = async (): Promise<ApiResponse<CategoryResponse[]>> => {
    const { data } = await publicHttp.get<ApiResponse<CategoryResponse[]>>('/categories/products');
    return data;
};

export const getCategoryById = async (id: number): Promise<ApiResponse<CategoryResponse>> => {
    const { data } = await http.get<ApiResponse<CategoryResponse>>(`/categories/${id}`);
    return data;
};

export const createCategory = async (category: CategoryCreateModel): Promise<ApiResponse<object>> => {
    const { data } = await http.post<ApiResponse<object>>('/categories', category);
    return data;
};

export const updateCategory = async (id: number, category: CategoryEditModel): Promise<ApiResponse<object>> => {
    const { data } = await http.put<ApiResponse<object>>(`/categories/${id}`, category);
    return data;
};

export const deleteCategory = async (id: number): Promise<ApiResponse<object>> => {
    const response = await http.delete(`/categories/${id}`);
    
    // Si el status code es 204 (No Content), no hay data en la respuesta
    if (response.status === 204) {
        return {
            status: true,
            statusCode: 204,
            message: "Categoría eliminada exitosamente"
        };
    }
    
    return response.data;
}; 