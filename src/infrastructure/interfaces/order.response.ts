export interface OrderResponse {
    id: number;
    userId: string;
    totalAmount: number;
    status: string;
    orderDetails: OrderDetailResponse[];
}

export interface OrderDetailResponse {
    id: number;
    orderId: number;
    productId?: number;
    productName?: string;
    productSellerId?: string;
    quantity: number;
    unitPrice: number;
} 