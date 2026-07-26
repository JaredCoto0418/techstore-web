import axios from "axios";
import type { ApiResponse } from "../../infrastructure/interfaces/api.response";
import type { CategoryResponse } from "../../infrastructure/interfaces/category.response";
import type { CategoryCreateModel, CategoryEditModel } from "../models/category.model";

export const categoriesApi = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "https://localhost:7066/api",
});

// Instancia para peticiones públicas (sin interceptor de autorización)
export const publicCategoriesApi = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "https://localhost:7066/api",
});

// Configurar interceptor para agregar token solo a peticiones autenticadas
categoriesApi.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const getCategories = async (searchTerm = "", page = 1, pageSize = 0): Promise<ApiResponse<CategoryResponse[]>> => {
    const { data } = await categoriesApi.get<ApiResponse<CategoryResponse[]>>('/categories', {
        params: { searchTerm, page, pageSize }
    });
    return data;
};

export const getProductCategories = async (): Promise<ApiResponse<CategoryResponse[]>> => {
    const { data } = await publicCategoriesApi.get<ApiResponse<CategoryResponse[]>>('/categories/products');
    return data;
};

export const getCategoryById = async (id: number): Promise<ApiResponse<CategoryResponse>> => {
    const { data } = await categoriesApi.get<ApiResponse<CategoryResponse>>(`/categories/${id}`);
    return data;
};

export const createCategory = async (category: CategoryCreateModel): Promise<ApiResponse<object>> => {
    const { data } = await categoriesApi.post<ApiResponse<object>>('/categories', category);
    return data;
};

export const updateCategory = async (id: number, category: CategoryEditModel): Promise<ApiResponse<object>> => {
    const { data } = await categoriesApi.put<ApiResponse<object>>(`/categories/${id}`, category);
    return data;
};

export const deleteCategory = async (id: number): Promise<ApiResponse<object>> => {
    const response = await categoriesApi.delete(`/categories/${id}`);
    
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