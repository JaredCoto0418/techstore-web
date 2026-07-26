import { AxiosError } from 'axios';
import { getProducts, getProductById, createProduct, createProductWithImage, updateProduct, updateProductWithImage, deleteProduct, getProductCatalog, getMyProducts } from '../../api/products.api';
import type { ApiResponse } from '../../../infrastructure/interfaces/api.response';
import type { ApiErrorResponse } from '../../../infrastructure/interfaces/api-error.response';
import type { ProductResponse } from '../../../infrastructure/interfaces/product.response';
import type { ProductCreateModel, ProductEditModel } from '../../models/product.model';

export const getProductsAction = async (searchTerm = "", page = 1, pageSize = 0): Promise<ApiResponse<ProductResponse[]>> => {
    try {
        return await getProducts(searchTerm, page, pageSize);
    } catch (error) {
        const apiError = error as AxiosError<ApiErrorResponse>;
        return {
            status: false,
            message: apiError.response?.data?.message || "Error al obtener productos",
        };
    }
};

export const getProductByIdAction = async (id: number): Promise<ApiResponse<ProductResponse>> => {
    try {
        return await getProductById(id);
    } catch (error) {
        const apiError = error as AxiosError<ApiErrorResponse>;
        return {
            status: false,
            message: apiError.response?.data?.message || "Error al obtener el producto",
        };
    }
};

export const createProductAction = async (product: ProductCreateModel): Promise<ApiResponse<object>> => {
    try {
        return await createProduct(product);
    } catch (error) {
        const apiError = error as AxiosError<ApiErrorResponse>;
        return {
            status: false,
            message: apiError.response?.data?.message || "Error al crear el producto",
        };
    }
};

export const createProductWithImageAction = async (product: ProductCreateModel, imageFile?: File): Promise<ApiResponse<object>> => {
    try {
        return await createProductWithImage(product, imageFile);
    } catch (error) {
        const apiError = error as AxiosError<ApiErrorResponse>;
        return {
            status: false,
            message: apiError.response?.data?.message || "Error al crear el producto con imagen",
        };
    }
};

export const updateProductAction = async (id: number, product: ProductEditModel): Promise<ApiResponse<object>> => {
    try {
        return await updateProduct(id, product);
    } catch (error) {
        const apiError = error as AxiosError<ApiErrorResponse>;
        return {
            status: false,
            message: apiError.response?.data?.message || "Error al actualizar el producto",
        };
    }
};

export const updateProductWithImageAction = async (id: number, product: ProductEditModel, imageFile?: File): Promise<ApiResponse<object>> => {
    try {
        return await updateProductWithImage(id, product, imageFile);
    } catch (error) {
        const apiError = error as AxiosError<ApiErrorResponse>;
        return {
            status: false,
            message: apiError.response?.data?.message || "Error al actualizar el producto con imagen",
        };
    }
};

export const deleteProductAction = async (id: number): Promise<ApiResponse<object>> => {
    try {
        return await deleteProduct(id);
    } catch (error) {
        const apiError = error as AxiosError<ApiErrorResponse>;
        return {
            status: false,
            message: apiError.response?.data?.message || "Error al eliminar el producto",
        };
    }
};

export const getProductCatalogAction = async (): Promise<ApiResponse<ProductResponse[]>> => {
    try {
        return await getProductCatalog();
    } catch (error) {
        const apiError = error as AxiosError<ApiErrorResponse>;
        return {
            status: false,
            message: apiError.response?.data?.message || "Error al obtener el catálogo de productos",
        };
    }
};

export const getMyProductsAction = async (): Promise<ApiResponse<ProductResponse[]>> => {
    try {
        return await getMyProducts();
    } catch (error) {
        const apiError = error as AxiosError<ApiErrorResponse>;
        return {
            status: false,
            message: apiError.response?.data?.message || "Error al obtener mis productos",
        };
    }
}; 