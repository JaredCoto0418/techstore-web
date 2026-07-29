import { AxiosError } from "axios";
import type { ApiResponse } from "../../../infrastructure/interfaces/api.response";
import type { TransactionResponse } from "../../../infrastructure/interfaces/transaction.response";
import type { ApiErrorResponse } from "../../../infrastructure/interfaces/api-error.response";
import { getMyTransactions, getAllTransactions } from "../../api/transactions.api";

export const getMyTransactionsAction = async (): Promise<ApiResponse<TransactionResponse[]>> => {
    try {
        return await getMyTransactions();
    } catch (error) {
        const apiError = error as AxiosError<ApiErrorResponse>;
        return {
            status: false,
            message: apiError.response?.data?.message || "Error al obtener mis transacciones",
        };
    }
};

export const getAllTransactionsAction = async (): Promise<ApiResponse<TransactionResponse[]>> => {
    try {
        return await getAllTransactions();
    } catch (error) {
        const apiError = error as AxiosError<ApiErrorResponse>;
        return {
            status: false,
            message: apiError.response?.data?.message || "Error al obtener transacciones",
        };
    }
};
