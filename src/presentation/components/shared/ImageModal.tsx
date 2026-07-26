import React from 'react';

interface ImageModalProps {
    isOpen: boolean;
    onClose: () => void;
    imageUrl: string;
    alt: string;
}

export const ImageModal: React.FC<ImageModalProps> = ({
    isOpen,
    onClose,
    imageUrl,
    alt
}) => {
    const baseUrl = import.meta.env.VITE_API_URL || 'https://localhost:7066';

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
            <div className="relative max-w-4xl max-h-full p-4">
                {/* Botón de cerrar */}
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 z-10 bg-white bg-opacity-80 hover:bg-opacity-100 text-gray-800 rounded-full w-10 h-10 flex items-center justify-center transition-all duration-200 hover:scale-110"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Imagen */}
                <div className="relative">
                    <img
                        src={`${baseUrl}${imageUrl}`}
                        alt={alt}
                        className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const fallback = target.parentElement?.querySelector('.modal-fallback') as HTMLElement;
                            if (fallback) fallback.style.display = 'flex';
                        }}
                    />
                    
                    {/* Fallback para error */}
                    <div className="modal-fallback hidden absolute inset-0 bg-gray-100 rounded-lg flex items-center justify-center">
                        <div className="text-gray-400 text-center">
                            <svg className="w-16 h-16 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                            </svg>
                            <span className="text-lg font-medium">Error al cargar la imagen</span>
                        </div>
                    </div>
                </div>

                {/* Controles adicionales */}
                <div className="mt-4 text-center">
                    <p className="text-white text-sm opacity-75">{alt}</p>
                </div>
            </div>

            {/* Overlay para cerrar al hacer clic */}
            <div 
                className="absolute inset-0 -z-10" 
                onClick={onClose}
            />
        </div>
    );
}; 