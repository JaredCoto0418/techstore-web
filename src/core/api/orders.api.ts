import { http } from "./http";
import type { ApiResponse } from "../../infrastructure/interfaces/api.response";
import type { OrderResponse } from "../../infrastructure/interfaces/order.response";
import type { OrderCreateModel, OrderEditModel, OrderStatusUpdateModel } from "../models/order.model";

export const getOrders = async (searchTerm = "", page = 1, pageSize = 0): Promise<ApiResponse<OrderResponse[]>> => {
    const { data } = await http.get<ApiResponse<OrderResponse[]>>('/orders', {
        params: { searchTerm, page, pageSize }
    });
    return data;
};

export const getOrderById = async (id: number): Promise<ApiResponse<OrderResponse>> => {
    const { data } = await http.get<ApiResponse<OrderResponse>>(`/orders/${id}`);
    return data;
};

export const createOrder = async (order: OrderCreateModel): Promise<ApiResponse<object>> => {
    const { data } = await http.post<ApiResponse<object>>('/orders', order);
    return data;
};

export const updateOrder = async (id: number, order: OrderEditModel): Promise<ApiResponse<object>> => {
    const { data } = await http.put<ApiResponse<object>>(`/orders/${id}`, order);
    return data;
};

export const deleteOrder = async (id: number): Promise<ApiResponse<object>> => {
    const response = await http.delete(`/orders/${id}`);
    
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
    const { data } = await http.get<ApiResponse<OrderResponse[]>>('/orders/my-orders');
    return data;
};

export const updateOrderStatus = async (id: number, statusUpdate: OrderStatusUpdateModel): Promise<ApiResponse<object>> => {
    const { data } = await http.put<ApiResponse<object>>(`/orders/${id}/status`, statusUpdate);
    return data;
}; 