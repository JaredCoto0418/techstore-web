import React, { useState } from 'react';
import toast from 'react-hot-toast';
import type { ProductCreateModel } from '../../../core/models/product.model';
import type { ProductResponse } from '../../../infrastructure/interfaces/product.response';
import type { CategoryResponse } from '../../../infrastructure/interfaces/category.response';
import type { UserResponse } from '../../../infrastructure/interfaces/user.response';
import { validateImageFile } from '../../../core/utils/image.util';
import { getUserIdFromToken } from '../../../core/utils/token.util';
import { STATIC_BASE_URL } from '../../../core/config';

interface ProductFormModalProps {
    title: string;
    submitLabel: string;
    categories: CategoryResponse[];
    /** Si se pasa, muestra el selector de vendedor (uso admin). Si no, el vendedor se resuelve solo. */
    sellers?: UserResponse[];
    /** Producto a editar. Si no se pasa, el modal es de creación. */
    initialProduct?: ProductResponse;
    onClose: () => void;
    onSubmit: (product: ProductCreateModel, imageFile?: File) => void;
}

export const ProductFormModal = ({
    title,
    submitLabel,
    categories,
    sellers,
    initialProduct,
    onClose,
    onSubmit,
}: ProductFormModalProps) => {
    const [formData, setFormData] = useState<ProductCreateModel>({
        name: initialProduct?.name ?? '',
        description: initialProduct?.description ?? '',
        price: initialProduct?.price ?? 0,
        stock: initialProduct?.stock ?? 0,
        categoryId: initialProduct?.categoryId ?? 0,
        // admin elige vendedor; al editar se conserva; al crear (vendor) se toma del token
        sellerId: initialProduct?.sellerId ?? (sellers ? '' : getUserIdFromToken()),
        imageUrl: initialProduct?.imageUrl ?? '',
    });
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(
        initialProduct?.imageUrl ? `${STATIC_BASE_URL}${initialProduct.imageUrl}` : null
    );

    const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const error = validateImageFile(file);
        if (error) {
            toast.error(error);
            return;
        }

        setSelectedImage(file);
        const reader = new FileReader();
        reader.onload = (e) => setImagePreview(e.target?.result as string);
        reader.readAsDataURL(file);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData, selectedImage || undefined);
    };

    const inputClass = 'mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500';

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-full max-w-lg shadow-lg rounded-md bg-white">
                <div className="mt-3">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Nombre</label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className={inputClass}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Descripción</label>
                            <textarea
                                required
                                rows={3}
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className={inputClass}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Precio</label>
                            <input
                                type="number"
                                step="0.01"
                                required
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                                className={inputClass}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Stock</label>
                            <input
                                type="number"
                                required
                                value={formData.stock}
                                onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                                className={inputClass}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Categoría</label>
                            <select
                                required
                                value={formData.categoryId}
                                onChange={(e) => setFormData({ ...formData, categoryId: parseInt(e.target.value) })}
                                className={inputClass}
                            >
                                <option value={0}>Seleccionar categoría</option>
                                {categories.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {sellers && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Vendedor</label>
                                <select
                                    required
                                    value={formData.sellerId}
                                    onChange={(e) => setFormData({ ...formData, sellerId: e.target.value })}
                                    className={inputClass}
                                >
                                    <option value="">Seleccionar vendedor</option>
                                    {sellers.map((seller) => (
                                        <option key={seller.id} value={seller.id}>
                                            {seller.firstName} {seller.lastName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Imagen del Producto</label>
                            <input type="file" accept="image/*" onChange={handleImageSelect} className={inputClass} />
                            {imagePreview && (
                                <img src={imagePreview} alt="Vista previa" className="mt-2 w-32 h-32 object-cover rounded border" />
                            )}
                            <p className="mt-1 text-xs text-gray-500">Formatos: JPG, PNG, GIF, BMP. Máximo 5MB.</p>
                        </div>

                        <div className="flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700"
                            >
                                {submitLabel}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
