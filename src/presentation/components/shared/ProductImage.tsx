import React, { useState } from 'react';
import { ImageModal } from './ImageModal';
import { STATIC_BASE_URL } from '../../../core/config';

interface ProductImageProps {
    imageUrl?: string;
    productName: string;
    className?: string;
    size?: 'sm' | 'md' | 'lg';
    displayMode?: 'contain' | 'cover' | 'fill';
    clickable?: boolean;
}

export const ProductImage: React.FC<ProductImageProps> = ({
    imageUrl,
    productName,
    className = '',
    size = 'md',
    displayMode = 'contain',
    clickable = true
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const sizeClasses = {
        sm: 'w-20 h-20',
        md: 'w-full h-48',
        lg: 'w-full h-64'
    };

    const displayModeClasses = {
        contain: 'object-contain',
        cover: 'object-cover',
        fill: 'object-fill'
    };

    const handleImageClick = () => {
        if (clickable && imageUrl) {
            setIsModalOpen(true);
        }
    };

    if (!imageUrl) {
        return (
            <div className={`${sizeClasses[size]} bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center ${className} border border-gray-200`}>
                <div className="text-gray-400 text-center">
                    <svg className="w-12 h-12 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm font-medium">Sin imagen</span>
                </div>
            </div>
        );
    }

    return (
        <>
            <div 
                className={`${sizeClasses[size]} relative overflow-hidden rounded-lg ${className} bg-gray-100 flex items-center justify-center ${clickable ? 'cursor-pointer group' : ''}`}
                onClick={handleImageClick}
            >
                <img
                    src={`${STATIC_BASE_URL}${imageUrl}`}
                    alt={productName}
                    className={`w-full h-full ${displayModeClasses[displayMode]} transition-transform duration-300 hover:scale-105`}
                    onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const fallback = target.parentElement?.querySelector('.fallback') as HTMLElement;
                        if (fallback) fallback.style.display = 'flex';
                    }}
                />
                
                {/* Overlay con icono de zoom cuando es clickeable */}
                {clickable && (
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white bg-opacity-90 rounded-full p-2">
                            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                            </svg>
                        </div>
                    </div>
                )}

                {/* Fallback que se muestra si la imagen falla */}
                <div className="fallback hidden absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                    <div className="text-gray-400 text-center">
                        <svg className="w-12 h-12 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm font-medium">Error al cargar</span>
                    </div>
                </div>
            </div>

            {/* Modal para vista completa */}
            {clickable && (
                <ImageModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    imageUrl={imageUrl}
                    alt={productName}
                />
            )}
        </>
    );
}; 