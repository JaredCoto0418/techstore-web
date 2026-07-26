import React, { useState, useEffect } from 'react';
import { useProducts } from '../../hooks/useProducts.tsx';
import { useCategories } from '../../hooks/useCategories.tsx';
import { useAuthStore } from '../../stores/authStore.ts';
import { Role } from '../../../infrastructure/enums/role.enum.ts';
import { type ProductCreateModel, type ProductEditModel } from '../../../core/models/product.model.ts';
import { ProductImage } from '../../components/shared/ProductImage';

export const VendorProductsPage = () => {
    const { products, loading, error, fetchMyProducts, createProductWithImage, updateProductWithImage, deleteProduct } = useProducts();
    const { categories, fetchProductCategories } = useCategories();
    const { authenticated, roles } = useAuthStore();
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<any>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const isVendor = roles?.includes(Role.VENDEDOR) || false;

    useEffect(() => {
        // Solo hacer las peticiones si el usuario está autenticado y es vendedor
        if (authenticated && isVendor) {
            fetchMyProducts();
            fetchProductCategories(); // Solo categorías de productos
        }
    }, [authenticated, isVendor]);

    const handleCreateProduct = async (productData: ProductCreateModel, imageFile?: File) => {
        const success = await createProductWithImage(productData, imageFile);
        if (success) {
            setShowCreateModal(false);
            // Recargar solo mis productos
            fetchMyProducts();
        }
    };

    const handleUpdateProduct = async (id: number, productData: ProductEditModel, imageFile?: File) => {
        const success = await updateProductWithImage(id, productData, imageFile);
        if (success) {
            setShowEditModal(false);
            setSelectedProduct(null);
            // Recargar solo mis productos
            fetchMyProducts();
        }
    };

    const handleDeleteProduct = async (id: number) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
            await deleteProduct(id);
        }
    };

    const handleEdit = (product: any) => {
        setSelectedProduct(product);
        setShowEditModal(true);
    };

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.categoryName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Si no está autenticado, mostrar mensaje de carga
    if (!authenticated) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (!isVendor) {
        return (
            <div className="text-center py-12">
                <h1 className="text-2xl font-bold text-red-600 mb-4">
                    Acceso Denegado
                </h1>
                <p className="text-gray-600">
                    No tienes permisos para acceder a esta página.
                </p>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">Mis Productos</h1>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md transition-colors"
                >
                    Agregar Producto
                </button>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            )}

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                    <input
                        type="text"
                        placeholder="Buscar productos..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Producto
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Categoría
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Precio
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Stock
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredProducts.map((product) => (
                                <tr key={product.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center space-x-3">
                                            <ProductImage 
                                                imageUrl={product.imageUrl} 
                                                productName={product.name} 
                                                size="sm" 
                                                className="flex-shrink-0"
                                            />
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                                <div className="text-sm text-gray-500 max-w-xs truncate">{product.description}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {product.categoryName}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        ${product.price}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {product.stock}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button
                                            onClick={() => handleEdit(product)}
                                            className="text-indigo-600 hover:text-indigo-900 mr-3"
                                        >
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => handleDeleteProduct(product.id)}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {showCreateModal && (
                <CreateProductModal
                    categories={categories}
                    onClose={() => setShowCreateModal(false)}
                    onSubmit={handleCreateProduct}
                />
            )}

            {showEditModal && selectedProduct && (
                <EditProductModal
                    product={selectedProduct}
                    categories={categories}
                    onClose={() => setShowEditModal(false)}
                    onSubmit={handleUpdateProduct}
                />
            )}
        </div>
    );
};

const CreateProductModal = ({ categories, onClose, onSubmit }: { 
    categories: any[]; 
    onClose: () => void; 
    onSubmit: (product: ProductCreateModel, imageFile?: File) => void 
}) => {

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: 0,
        stock: 0,
        categoryId: 0,
        sellerId: '',
        imageUrl: ''
    });
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
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

            setSelectedImage(file);
            
            // Crear preview
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Asegurar que el sellerId esté establecido correctamente
        const token = localStorage.getItem('token');
        let sellerId = '';
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                sellerId = payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] || '';
            } catch (error) {
                console.error('Error parsing token:', error);
            }
        }
        
        const productData = {
            ...formData,
            sellerId: sellerId
        };
        
        onSubmit(productData, selectedImage || undefined);
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-[600px] shadow-lg rounded-md bg-white">
                <div className="mt-3">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Agregar Producto</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Nombre</label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Descripción</label>
                            <textarea
                                required
                                value={formData.description}
                                onChange={(e) => setFormData({...formData, description: e.target.value})}
                                rows={3}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Precio</label>
                            <input
                                type="number"
                                step="0.01"
                                required
                                value={formData.price}
                                onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Stock</label>
                            <input
                                type="number"
                                required
                                value={formData.stock}
                                onChange={(e) => setFormData({...formData, stock: parseInt(e.target.value)})}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Categoría</label>
                            <select
                                required
                                value={formData.categoryId}
                                onChange={(e) => setFormData({...formData, categoryId: parseInt(e.target.value)})}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <option value={0}>Seleccionar categoría</option>
                                {categories.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        
                        {/* Componente de subida de imágenes */}
                        <div className="space-y-4">
                            <div className="flex items-center space-x-4">
                                <label className="block text-sm font-medium text-gray-700">
                                    Imagen del Producto
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageSelect}
                                    className="hidden"
                                    id="image-upload"
                                />
                                <button
                                    type="button"
                                    onClick={() => document.getElementById('image-upload')?.click()}
                                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                                >
                                    Seleccionar Imagen
                                </button>
                            </div>

                            {imagePreview && (
                                <div className="space-y-2">
                                    <div className="relative inline-block">
                                        <img
                                            src={imagePreview}
                                            alt="Vista previa"
                                            className="w-32 h-32 object-cover rounded border"
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500">
                                        Formatos permitidos: JPG, PNG, GIF, BMP. Máximo 5MB.
                                    </p>
                                </div>
                            )}

                            {!imagePreview && (
                                <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded flex items-center justify-center">
                                    <p className="text-xs text-gray-500 text-center">
                                        Sin imagen
                                    </p>
                                </div>
                            )}
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
                                Crear
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

const EditProductModal = ({ product, categories, onClose, onSubmit }: { 
    product: any; 
    categories: any[]; 
    onClose: () => void; 
    onSubmit: (id: number, product: ProductEditModel, imageFile?: File) => void;
}) => {
    const [formData, setFormData] = useState({
        name: product.name,
        description: product.description || '',
        price: product.price,
        stock: product.stock,
        categoryId: product.categoryId,
        sellerId: product.sellerId,
        imageUrl: product.imageUrl || ''
    });
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const baseUrl = import.meta.env.VITE_API_URL || 'https://localhost:7066';
    const [imagePreview, setImagePreview] = useState<string | null>(
        product.imageUrl ? `${baseUrl}${product.imageUrl}` : null
    );

    const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
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

            setSelectedImage(file);
            
            // Crear preview
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(product.id, formData, selectedImage || undefined);
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-[600px] shadow-lg rounded-md bg-white">
                <div className="mt-3">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Editar Producto</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Nombre</label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Descripción</label>
                            <textarea
                                required
                                value={formData.description}
                                onChange={(e) => setFormData({...formData, description: e.target.value})}
                                rows={3}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Precio</label>
                            <input
                                type="number"
                                step="0.01"
                                required
                                value={formData.price}
                                onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Stock</label>
                            <input
                                type="number"
                                required
                                value={formData.stock}
                                onChange={(e) => setFormData({...formData, stock: parseInt(e.target.value)})}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Categoría</label>
                            <select
                                required
                                value={formData.categoryId}
                                onChange={(e) => setFormData({...formData, categoryId: parseInt(e.target.value)})}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <option value={0}>Seleccionar categoría</option>
                                {categories.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        
                        {/* Componente de subida de imágenes */}
                        <div className="space-y-4">
                            <div className="flex items-center space-x-4">
                                <label className="block text-sm font-medium text-gray-700">
                                    Imagen del Producto
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageSelect}
                                    className="hidden"
                                    id="image-upload"
                                />
                                <button
                                    type="button"
                                    onClick={() => document.getElementById('image-upload')?.click()}
                                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                                >
                                    Seleccionar Imagen
                                </button>
                            </div>

                            {imagePreview && (
                                <div className="space-y-2">
                                    <div className="relative inline-block">
                                        <img
                                            src={imagePreview}
                                            alt="Vista previa"
                                            className="w-32 h-32 object-cover rounded border"
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500">
                                        Formatos permitidos: JPG, PNG, GIF, BMP. Máximo 5MB.
                                    </p>
                                </div>
                            )}

                            {!imagePreview && (
                                <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded flex items-center justify-center">
                                    <p className="text-xs text-gray-500 text-center">
                                        Sin imagen
                                    </p>
                                </div>
                            )}
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
                                Actualizar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}; 