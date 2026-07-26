export interface ProductCreateModel {
    name: string;
    description: string;
    price: number;
    stock: number;
    categoryId: number;
    sellerId: string;
    imageUrl?: string;
}

export interface ProductEditModel {
    name: string;
    description: string;
    price: number;
    stock: number;
    categoryId: number;
    sellerId: string;
    imageUrl?: string;
} 