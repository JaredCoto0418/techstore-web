import { http } from "./http";
import type { ApiResponse } from "../../infrastructure/interfaces/api.response";

export const createPayPalOrder = async (orderId: number): Promise<ApiResponse<{ paypalOrderId: string }>> => {
    const { data } = await http.post<ApiResponse<{ paypalOrderId: string }>>('/payments/create-order', { orderId });
    return data;
};

export const capturePayment = async (orderId: number, paypalOrderId: string): Promise<ApiResponse<object>> => {
    const { data } = await http.post<ApiResponse<object>>('/payments/capture', { orderId, paypalOrderId });
    return data;
};
