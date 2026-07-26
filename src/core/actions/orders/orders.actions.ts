import { AxiosError } from "axios";
import type { ApiResponse } from "../../../infrastructure/interfaces/api.response";
import type { OrderResponse } from "../../../infrastructure/interfaces/order.response";
import type { OrderCreateModel, OrderEditModel } from "../../models/order.model";
import type { ApiErrorResponse } from "../../../infrastructure/interfaces/api-error.response";
import { getOrders, getOrderById, createOrder, updateOrder, deleteOrder, getMyOrders } from "../../api/orders.api";
import { Role } from "../../../infrastructure/enums/role.enum";

export const getOrdersAction = async (searchTerm = "", page = 1, pageSize = 0, userRoles?: Role[]): Promise<ApiResponse<OrderResponse[]>> => {
    try {
        // Si el usuario es administrador, obtiene todas las órdenes
        // Si no es administrador, obtiene solo sus órdenes
        if (userRoles?.includes(Role.ADMINISTRADOR)) {
            return await getOrders(searchTerm, page, pageSize);
        } else {
            return await getMyOrders();
        }
    } catch (error) {
        const apiError = error as AxiosError<ApiErrorResponse>;
        return {
            status: false,
            message: apiError.response?.data?.message || "Error al obtener órdenes",
        };
    }
};

export const getMyOrdersAction = async (): Promise<ApiResponse<OrderResponse[]>> => {
    try {
        return await getMyOrders();
    } catch (error) {
        const apiError = error as AxiosError<ApiErrorResponse>;
        return {
            status: false,
            message: apiError.response?.data?.message || "Error al obtener mis órdenes",
        };
    }
};

export const getOrderByIdAction = async (id: number): Promise<ApiResponse<OrderResponse>> => {
    try {
        return await getOrderById(id);
    } catch (error) {
        const apiError = error as AxiosError<ApiErrorResponse>;
        return {
            status: false,
            message: apiError.response?.data?.message || "Error al obtener orden",
        };
    }
};

export const createOrderAction = async (order: OrderCreateModel): Promise<ApiResponse<object>> => {
    try {
        return await createOrder(order);
    } catch (error) {
        const apiError = error as AxiosError<ApiErrorResponse>;
        return {
            status: false,
            message: apiError.response?.data?.message || "Error al crear orden",
        };
    }
};

export const updateOrderAction = async (id: number, order: OrderEditModel): Promise<ApiResponse<object>> => {
    try {
        return await updateOrder(id, order);
    } catch (error) {
        const apiError = error as AxiosError<ApiErrorResponse>;
        return {
            status: false,
            message: apiError.response?.data?.message || "Error al actualizar orden",
        };
    }
};

export const deleteOrderAction = async (id: number): Promise<ApiResponse<object>> => {
    try {
        const response = await deleteOrder(id);
        // Si la respuesta es 204 (No Content), consideramos que fue exitosa
        if (response.statusCode === 204) {
            return {
                status: true,
                statusCode: 204,
                message: "Orden eliminada exitosamente"
            };
        }
        return response;
    } catch (error) {
        const apiError = error as AxiosError<ApiErrorResponse>;
        return {
            status: false,
            message: apiError.response?.data?.message || "Error al eliminar orden",
        };
    }
}; 