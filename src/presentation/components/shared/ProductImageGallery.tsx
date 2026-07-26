import React from 'react';
import { ProductImage } from './ProductImage';

interface ProductImageGalleryProps {
    imageUrl?: string;
    productName: string;
    className?: string;
    variant?: 'card' | 'grid' | 'hero' | 'thumbnail';
}

export const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({
    imageUrl,
    productName,
    className = '',
    variant = 'card'
}) => {
    const variants = {
        card: {
            size: 'md' as const,
            displayMode: 'contain' as const,
            containerClass: 'bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300'
        },
        grid: {
            size: 'lg' as const,
            displayMode: 'cover' as const,
            containerClass: 'bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1'
        },
        hero: {
            size: 'lg' as const,
            displayMode: 'cover' as const,
            containerClass: 'bg-white rounded-2xl shadow-2xl overflow-hidden'
        },
        thumbnail: {
            size: 'sm' as const,
            displayMode: 'contain' as const,
            containerClass: 'bg-white rounded-md shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200'
        }
    };

    const config = variants[variant];

    return (
        <div className={`${config.containerClass} ${className}`}>
            <ProductImage
                imageUrl={imageUrl}
                productName={productName}
                size={config.size}
                displayMode={config.displayMode}
                clickable={true}
                className="w-full"
            />
        </div>
    );
}; 