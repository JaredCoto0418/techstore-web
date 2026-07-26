import React, { useState, useRef } from 'react';

interface ImageUploadProps {
    currentImageUrl?: string;
    onImageUpload: (productId: number, file: File) => Promise<void>;
    onImageDelete: (imageUrl: string) => Promise<void>;
    productId: number;
    disabled?: boolean;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
    currentImageUrl,
    onImageUpload,
    onImageDelete,
    productId,
    disabled = false
}) => {
    const [isUploading, setIsUploading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Validar tipo de archivo
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/bmp'];
        if (!allowedTypes.includes(file.type)) {
            alert('Formato de archivo no válido. Use JPG, PNG, GIF o BMP.');
            return;
        }

        // Validar tamaño (5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('El archivo es demasiado grande. Máximo 5MB.');
            return;
        }

        setIsUploading(true);
        try {
            await onImageUpload(productId, file);
        } catch (error) {
            console.error('Error al subir imagen:', error);
        } finally {
            setIsUploading(false);
        }
    };

    const handleDeleteImage = async () => {
        if (!currentImageUrl) return;

        const confirmed = window.confirm('¿Estás seguro de que quieres eliminar esta imagen?');
        if (!confirmed) return;

        setIsDeleting(true);
        try {
            await onImageDelete(currentImageUrl);
        } catch (error) {
            console.error('Error al eliminar imagen:', error);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center space-x-4">
                <label className="block text-sm font-medium text-gray-700">
                    Imagen del Producto
                </label>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    disabled={disabled || isUploading}
                    className="hidden"
                />
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={disabled || isUploading}
                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    {isUploading ? 'Subiendo...' : 'Seleccionar Imagen'}
                </button>
            </div>

            {currentImageUrl && (
                <div className="space-y-2">
                    <div className="relative inline-block">
                        <img
                            src={`${import.meta.env.VITE_API_URL || 'https://localhost:7066'}${currentImageUrl}`}
                            alt="Producto"
                            className="w-32 h-32 object-cover rounded border"
                            onError={(e) => {
                                e.currentTarget.style.display = 'none';
                            }}
                        />
                        <button
                            type="button"
                            onClick={handleDeleteImage}
                            disabled={disabled || isDeleting}
                            className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                            title="Eliminar imagen"
                        >
                            {isDeleting ? '...' : '×'}
                        </button>
                    </div>
                    <p className="text-xs text-gray-500">
                        Formatos permitidos: JPG, PNG, GIF, BMP. Máximo 5MB.
                    </p>
                </div>
            )}

            {!currentImageUrl && (
                <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded flex items-center justify-center">
                    <p className="text-xs text-gray-500 text-center">
                        Sin imagen
                    </p>
                </div>
            )}
        </div>
    );
}; 