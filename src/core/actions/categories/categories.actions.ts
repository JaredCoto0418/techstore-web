import { AxiosError } from "axios";
import type { ApiResponse } from "../../../infrastructure/interfaces/api.response";
import type { CategoryResponse } from "../../../infrastructure/interfaces/category.response";
import type { CategoryCreateModel, CategoryEditModel } from "../../models/category.model";
import type { ApiErrorResponse } from "../../../infrastructure/interfaces/api-error.response";
import { getCategories, getCategoryById, createCategory, updateCategory, deleteCategory, getProductCategories } from "../../api/categories.api";

export const getCategoriesAction = async (searchTerm = "", page = 1, pageSize = 0): Promise<ApiResponse<CategoryResponse[]>> => {
    try {
        return await getCategories(searchTerm, page, pageSize);
    } catch (error) {
        const apiError = error as AxiosError<ApiErrorResponse>;
        return {
            status: false,
            message: apiError.response?.data?.message || "Error al obtener categorías",
        };
    }
};

export const getProductCategoriesAction = async (): Promise<ApiResponse<CategoryResponse[]>> => {
    try {
        return await getProductCategories();
    } catch (error) {
        const apiError = error as AxiosError<ApiErrorResponse>;
        return {
            status: false,
            message: apiError.response?.data?.message || "Error al obtener categorías de productos",
        };
    }
};

export const getCategoryByIdAction = async (id: number): Promise<ApiResponse<CategoryResponse>> => {
    try {
        return await getCategoryById(id);
    } catch (error) {
        const apiError = error as AxiosError<ApiErrorResponse>;
        return {
            status: false,
            message: apiError.response?.data?.message || "Error al obtener categoría",
        };
    }
};

export const createCategoryAction = async (category: CategoryCreateModel): Promise<ApiResponse<object>> => {
    try {
        return await createCategory(category);
    } catch (error) {
        const apiError = error as AxiosError<ApiErrorResponse>;
        return {
            status: false,
            message: apiError.response?.data?.message || "Error al crear categoría",
        };
    }
};

export const updateCategoryAction = async (id: number, category: CategoryEditModel): Promise<ApiResponse<object>> => {
    try {
        return await updateCategory(id, category);
    } catch (error) {
        const apiError = error as AxiosError<ApiErrorResponse>;
        return {
            status: false,
            message: apiError.response?.data?.message || "Error al actualizar categoría",
        };
    }
};

export const deleteCategoryAction = async (id: number): Promise<ApiResponse<object>> => {
    try {
        const response = await deleteCategory(id);
        // Si la respuesta es 204 (No Content), consideramos que fue exitosa
        if (response.statusCode === 204) {
            return {
                status: true,
                statusCode: 204,
                message: "Categoría eliminada exitosamente"
            };
        }
        return response;
    } catch (error) {
        const apiError = error as AxiosError<ApiErrorResponse>;
        return {
            status: false,
            message: apiError.response?.data?.message || "Error al eliminar categoría",
        };
    }
}; 