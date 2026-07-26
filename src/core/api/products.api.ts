import axios from "axios";
import type { ApiResponse } from "../../infrastructure/interfaces/api.response";
import type { ProductResponse } from "../../infrastructure/interfaces/product.response";
import type { ProductCreateModel, ProductEditModel } from "../models/product.model";

export const productsApi = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "https://localhost:7066/api",
});

// Instancia para peticiones públicas (sin interceptor de autorización)
export const publicProductsApi = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "https://localhost:7066/api",
});

// Configurar interceptor para agregar token solo a peticiones autenticadas
productsApi.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const getProducts = async (searchTerm = "", page = 1, pageSize = 0): Promise<ApiResponse<ProductResponse[]>> => {
    const { data } = await productsApi.get<ApiResponse<ProductResponse[]>>('/products', {
        params: { searchTerm, page, pageSize }
    });
    return data;
};

export const getProductCatalog = async (): Promise<ApiResponse<ProductResponse[]>> => {
    const { data } = await publicProductsApi.get<ApiResponse<ProductResponse[]>>('/products/catalog');
    return data;
};

export const getMyProducts = async (): Promise<ApiResponse<ProductResponse[]>> => {
    const { data } = await productsApi.get<ApiResponse<ProductResponse[]>>('/products/my-products');
    return data;
};

export const getProductById = async (id: number): Promise<ApiResponse<ProductResponse>> => {
    const { data } = await publicProductsApi.get<ApiResponse<ProductResponse>>(`/products/${id}`);
    return data;
};

export const createProduct = async (product: ProductCreateModel): Promise<ApiResponse<object>> => {
    const { data } = await productsApi.post<ApiResponse<object>>('/products', product);
    return data;
};

export const createProductWithImage = async (product: ProductCreateModel, imageFile?: File): Promise<ApiResponse<object>> => {
    const formData = new FormData();
    
    // Agregar los datos del producto individualmente
    formData.append('name', product.name);
    formData.append('description', product.description);
    formData.append('price', product.price.toString());
    formData.append('stock', product.stock.toString());
    formData.append('categoryId', product.categoryId.toString());
    formData.append('sellerId', product.sellerId);
    
    // Agregar la imagen si existe
    if (imageFile) {
        formData.append('imageFile', imageFile);
    }
    
    const { data } = await productsApi.post<ApiResponse<object>>('/products/with-image', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return data;
};

export const updateProduct = async (id: number, product: ProductEditModel): Promise<ApiResponse<object>> => {
    const { data } = await productsApi.put<ApiResponse<object>>(`/products/${id}`, product);
    return data;
};

export const updateProductWithImage = async (id: number, product: ProductEditModel, imageFile?: File): Promise<ApiResponse<object>> => {
    const formData = new FormData();
    
    // Agregar los datos del producto individualmente
    formData.append('name', product.name);
    formData.append('description', product.description);
    formData.append('price', product.price.toString());
    formData.append('stock', product.stock.toString());
    formData.append('categoryId', product.categoryId.toString());
    formData.append('sellerId', product.sellerId);
    
    // Agregar la imagen si existe
    if (imageFile) {
        formData.append('imageFile', imageFile);
    }
    
    // Agregar la imagen actual si no se proporciona una nueva imagen
    if (!imageFile && product.imageUrl) {
        formData.append('currentImageUrl', product.imageUrl);
    }
    
    const { data } = await productsApi.put<ApiResponse<object>>(`/products/${id}/with-image`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return data;
};

export const deleteProduct = async (id: number): Promise<ApiResponse<object>> => {
    const response = await productsApi.delete(`/products/${id}`);
    
    // Si el status code es 204 (No Content), no hay data en la respuesta
    if (response.status === 204) {
        return {
            status: true,
            statusCode: 204,
            message: "Producto eliminado exitosamente"
        };
    }
    
    return response.data;
}; 