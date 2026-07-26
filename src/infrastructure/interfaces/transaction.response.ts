export interface TransactionResponse {
    id: number;
    orderId: number;
    gatewayTransactionId?: string;
    status: string;
    amount: number;
    currency: string;
    paymentMethod: string;
    createdAt: string;
    // Datos de la orden asociada
    orderStatus: string;
    orderTotal: number;
}
