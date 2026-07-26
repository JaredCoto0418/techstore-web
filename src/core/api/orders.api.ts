import axios from "axios";
import type { ApiResponse } from "../../infrastructure/interfaces/api.response";
import type { OrderResponse } from "../../infrastructure/interfaces/order.response";
import type { OrderCreateModel, OrderEditModel, OrderStatusUpdateModel } from "../models/order.model";

export const ordersApi = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "https://localhost:7066/api",
});

// Configurar interceptor para agregar token
ordersApi.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const getOrders = async (searchTerm = "", page = 1, pageSize = 0): Promise<ApiResponse<OrderResponse[]>> => {
    const { data } = await ordersApi.get<ApiResponse<OrderResponse[]>>('/orders', {
        params: { searchTerm, page, pageSize }
    });
    return data;
};

export const getOrderById = async (id: number): Promise<ApiResponse<OrderResponse>> => {
    const { data } = await ordersApi.get<ApiResponse<OrderResponse>>(`/orders/${id}`);
    return data;
};

export const createOrder = async (order: OrderCreateModel): Promise<ApiResponse<object>> => {
    const { data } = await ordersApi.post<ApiResponse<object>>('/orders', order);
    return data;
};

export const updateOrder = async (id: number, order: OrderEditModel): Promise<ApiResponse<object>> => {
    const { data } = await ordersApi.put<ApiResponse<object>>(`/orders/${id}`, order);
    return data;
};

export const deleteOrder = async (id: number): Promise<ApiResponse<object>> => {
    const response = await ordersApi.delete(`/orders/${id}`);
    
    // Si el status code es 204 (No Content), no hay data en la respuesta
    if (response.status === 204) {
        return {
            status: true,
            statusCode: 204,
            message: "Orden eliminada exitosamente"
        };
    }
    
    return response.data;
}; 

export const getMyOrders = async (): Promise<ApiResponse<OrderResponse[]>> => {
    const { data } = await ordersApi.get<ApiResponse<OrderResponse[]>>('/orders/my-orders');
    return data;
};

export const updateOrderStatus = async (id: number, statusUpdate: OrderStatusUpdateModel): Promise<ApiResponse<object>> => {
    const { data } = await ordersApi.put<ApiResponse<object>>(`/orders/${id}/status`, statusUpdate);
    return data;
}; 