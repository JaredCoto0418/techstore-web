import { useState, useEffect } from 'react';
import { useProducts } from '../../hooks/useProducts.tsx';
import { useCategories } from '../../hooks/useCategories.tsx';
import { useAuthStore } from '../../stores/authStore.ts';
import { Role } from '../../../infrastructure/enums/role.enum.ts';
import { type ProductCreateModel, type ProductEditModel } from '../../../core/models/product.model.ts';
import type { ProductResponse } from '../../../infrastructure/interfaces/product.response';
import { ProductImage } from '../../components/shared/ProductImage';
import { ProductFormModal } from '../../components/shared/ProductFormModal';

export const VendorProductsPage = () => {
    const { products, loading, error, fetchMyProducts, createProductWithImage, updateProductWithImage, deleteProduct } = useProducts();
    const { categories, fetchProductCategories } = useCategories();
    const { authenticated, roles } = useAuthStore();
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<ProductResponse | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const isVendor = roles?.includes(Role.VENDEDOR) || false;

    useEffect(() => {
        if (authenticated && isVendor) {
            fetchMyProducts();
            fetchProductCategories();
        }
    }, [authenticated, isVendor]);

    const handleCreateProduct = async (productData: ProductCreateModel, imageFile?: File) => {
        const success = await createProductWithImage(productData, imageFile);
        if (success) {
            setShowCreateModal(false);
            fetchMyProducts();
        }
    };

    const handleUpdateProduct = async (id: number, productData: ProductEditModel, imageFile?: File) => {
        const success = await updateProductWithImage(id, productData, imageFile);
        if (success) {
            setShowEditModal(false);
            setSelectedProduct(null);
            fetchMyProducts();
        }
    };

    const handleDeleteProduct = async (id: number) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
            await deleteProduct(id);
        }
    };

    const handleEdit = (product: ProductResponse) => {
        setSelectedProduct(product);
        setShowEditModal(true);
    };

    if (!authenticated || loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (!isVendor) {
        return (
            <div className="text-center py-12">
                <h1 className="text-2xl font-bold text-red-600 mb-4">Acceso Denegado</h1>
                <p className="text-gray-600">No tienes permisos para acceder a esta página.</p>
            </div>
        );
    }

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.categoryName.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Producto</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoría</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredProducts.map((product) => (
                                <tr key={product.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center space-x-3">
                                            <ProductImage imageUrl={product.imageUrl} productName={product.name} size="sm" className="flex-shrink-0" />
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                                <div className="text-sm text-gray-500 max-w-xs truncate">{product.description}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.categoryName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${product.price}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.stock}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button onClick={() => handleEdit(product)} className="text-indigo-600 hover:text-indigo-900 mr-3">Editar</button>
                                        <button onClick={() => handleDeleteProduct(product.id)} className="text-red-600 hover:text-red-900">Eliminar</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {showCreateModal && (
                <ProductFormModal
                    title="Agregar Producto"
                    submitLabel="Crear"
                    categories={categories}
                    onClose={() => setShowCreateModal(false)}
                    onSubmit={handleCreateProduct}
                />
            )}

            {showEditModal && selectedProduct && (
                <ProductFormModal
                    title="Editar Producto"
                    submitLabel="Actualizar"
                    categories={categories}
                    initialProduct={selectedProduct}
                    onClose={() => { setShowEditModal(false); setSelectedProduct(null); }}
                    onSubmit={(data, imageFile) => handleUpdateProduct(selectedProduct.id, data, imageFile)}
                />
            )}
        </div>
    );
};
