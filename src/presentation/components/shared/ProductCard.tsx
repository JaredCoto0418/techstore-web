import type { ReactNode } from 'react';
import type { ProductResponse } from '../../../infrastructure/interfaces/product.response';
import { ProductImage } from './ProductImage';
import { formatCurrency } from '../../../core/utils/format.util';

interface ProductCardProps {
    product: ProductResponse;
    /** Muestra el nombre del vendedor (catálogo autenticado). */
    showSeller?: boolean;
    /** Acción del pie de la tarjeta (botón comprar / agregar al carrito / etc.). */
    children?: ReactNode;
}

export const ProductCard = ({ product, showSeller = false, children }: ProductCardProps) => (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
        <ProductImage imageUrl={product.imageUrl} productName={product.name} size="md" className="w-full" />
        <div className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
            <div className="flex justify-between items-center mb-4">
                <span className="text-2xl font-bold text-indigo-600">{formatCurrency(product.price)}</span>
                <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">
                    Stock: {product.stock}
                </span>
            </div>
            <div className="text-sm text-gray-500 mb-4 space-y-1">
                <p className="flex items-center">📂 {product.categoryName}</p>
                {showSeller && <p className="flex items-center">👤 {product.sellerName}</p>}
            </div>
            {children}
        </div>
    </div>
);
