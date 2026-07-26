export interface ProductResponse {
    id: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    categoryId: number;
    categoryName: string;
    sellerId: string;
    sellerName: string;
    imageUrl?: string;
} 