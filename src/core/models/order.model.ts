export interface OrderDetailModel {
    productId?: number;
    quantity: number;
    unitPrice: number;
}

export interface OrderCreateModel {
    userId: string;
    totalAmount?: number; // Opcional, el backend lo calculará
    status?: string;      // Opcional, el backend lo establecerá como "PENDIENTE"
    orderDetails: OrderDetailCreateModel[];
}

export interface OrderEditModel {
    userId: string;
    totalAmount: number;
    status: string;
    orderDetails: OrderDetailEditModel[];
}

export interface OrderStatusUpdateModel {
    status: string;
}

export interface OrderDetailCreateModel {
    productId?: number;
    quantity: number;
    unitPrice?: number; // Opcional, el backend lo calculará desde el producto
}

export interface OrderDetailEditModel {
    id: number;
    productId?: number;
    quantity: number;
    unitPrice: number;
} 