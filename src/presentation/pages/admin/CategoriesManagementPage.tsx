import React, { useState, useEffect } from 'react';
import { useCategories } from '../../hooks/useCategories.tsx';
import { useAuthStore } from '../../stores/authStore.ts';
import { Role } from '../../../infrastructure/enums/role.enum.ts';
import type { CategoryCreateModel, CategoryEditModel } from '../../../core/models/category.model.ts';

export const CategoriesManagementPage = () => {
    const { categories, loading, error, fetchCategories, createCategory, updateCategory, deleteCategory } = useCategories();
    const { roles } = useAuthStore();
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<any>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const isAdmin = roles?.includes(Role.ADMINISTRADOR);

    useEffect(() => {
        if (isAdmin) {
            fetchCategories();
        }
    }, [isAdmin]);

    const handleCreateCategory = async (categoryData: CategoryCreateModel) => {
        const success = await createCategory(categoryData);
        if (success) {
            setShowCreateModal(false);
        }
    };

    const handleUpdateCategory = async (id: number, categoryData: CategoryEditModel) => {
        const success = await updateCategory(id, categoryData);
        if (success) {
            setShowEditModal(false);
            setSelectedCategory(null);
        }
    };

    const handleDeleteCategory = async (id: number) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar esta categoría?')) {
            await deleteCategory(id);
        }
    };

    const handleEdit = (category: any) => {
        setSelectedCategory(category);
        setShowEditModal(true);
    };

    if (!isAdmin) {
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
                <h1 className="text-3xl font-bold text-gray-900">Gestión de Categorías</h1>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md transition-colors"
                >
                    Crear Categoría
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
                        placeholder="Buscar categorías..."
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
                                    ID
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Nombre
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Tipo
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {categories
                                .filter(category => 
                                    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                    category.type.toLowerCase().includes(searchTerm.toLowerCase())
                                )
                                .map((category) => (
                                <tr key={category.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {category.id}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">
                                            {category.name}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {category.type}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => handleEdit(category)}
                                                className="text-indigo-600 hover:text-indigo-900"
                                            >
                                                Editar
                                            </button>
                                            <button
                                                onClick={() => handleDeleteCategory(category.id)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                Eliminar
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal de Crear Categoría */}
            {showCreateModal && (
                <CreateCategoryModal
                    onClose={() => setShowCreateModal(false)}
                    onSubmit={handleCreateCategory}
                />
            )}

            {/* Modal de Editar Categoría */}
            {showEditModal && selectedCategory && (
                <EditCategoryModal
                    category={selectedCategory}
                    onClose={() => {
                        setShowEditModal(false);
                        setSelectedCategory(null);
                    }}
                    onSubmit={handleUpdateCategory}
                />
            )}
        </div>
    );
};

// Componente Modal para Crear Categoría
const CreateCategoryModal = ({ onClose, onSubmit }: { 
    onClose: () => void; 
    onSubmit: (category: CategoryCreateModel) => void 
}) => {
    const [formData, setFormData] = useState({
        name: '',
        type: 'Product' // Default value
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                <div className="mt-3">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Crear Categoría</h3>
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
                            <label className="block text-sm font-medium text-gray-700">Tipo</label>
                            <select
                                required
                                value={formData.type}
                                onChange={(e) => setFormData({...formData, type: e.target.value})}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <option value="Product">Producto</option>
                            </select>
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

// Componente Modal para Editar Categoría
const EditCategoryModal = ({ category, onClose, onSubmit }: { 
    category: any; 
    onClose: () => void; 
    onSubmit: (id: number, category: CategoryEditModel) => void 
}) => {
    const [formData, setFormData] = useState({
        name: category.name,
        type: category.type
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(category.id, formData);
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                <div className="mt-3">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Editar Categoría</h3>
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
                            <label className="block text-sm font-medium text-gray-700">Tipo</label>
                            <select
                                required
                                value={formData.type}
                                onChange={(e) => setFormData({...formData, type: e.target.value})}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <option value="Product">Producto</option>
                            </select>
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
                                Guardar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}; 