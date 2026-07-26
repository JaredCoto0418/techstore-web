import { http } from "./http";
import type { ApiResponse } from "../../infrastructure/interfaces/api.response";
import type { TransactionResponse } from "../../infrastructure/interfaces/transaction.response";

export const getMyTransactions = async (): Promise<ApiResponse<TransactionResponse[]>> => {
    const { data } = await http.get<ApiResponse<TransactionResponse[]>>('/transactions/my-transactions');
    return data;
};

export const getAllTransactions = async (): Promise<ApiResponse<TransactionResponse[]>> => {
    const { data } = await http.get<ApiResponse<TransactionResponse[]>>('/transactions');
    return data;
};
