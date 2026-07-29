import { AxiosError } from "axios";
import type { ApiResponse } from "../../../infrastructure/interfaces/api.response";
import type { ApiErrorResponse } from "../../../infrastructure/interfaces/api-error.response";
import { createPayPalOrder, capturePayment } from "../../api/payments.api";

export const createPayPalOrderAction = async (orderId: number): Promise<ApiResponse<{ paypalOrderId: string }>> => {
    try {
        return await createPayPalOrder(orderId);
    } catch (error) {
        const apiError = error as AxiosError<ApiErrorResponse>;
        return {
            status: false,
            message: apiError.response?.data?.message || "No se pudo iniciar el pago en PayPal",
        };
    }
};

export const capturePaymentAction = async (orderId: number, paypalOrderId: string): Promise<ApiResponse<object>> => {
    try {
        return await capturePayment(orderId, paypalOrderId);
    } catch (error) {
        const apiError = error as AxiosError<ApiErrorResponse>;
        return {
            status: false,
            message: apiError.response?.data?.message || "No se pudo confirmar el pago",
        };
    }
};
