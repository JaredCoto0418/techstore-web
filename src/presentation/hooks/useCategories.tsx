import { useState } from 'react';
import type { CategoryResponse } from '../../infrastructure/interfaces/category.response';
import type { CategoryCreateModel, CategoryEditModel } from '../../core/models/category.model';
import { getCategoriesAction, getCategoryByIdAction, createCategoryAction, updateCategoryAction, deleteCategoryAction, getProductCategoriesAction } from '../../core/actions/categories/categories.actions';

export const useCategories = () => {
    const [categories, setCategories] = useState<CategoryResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchCategories = async (searchTerm = "", page = 1, pageSize = 0) => {
        setLoading(true);
        setError(null);
        try {
            const response = await getCategoriesAction(searchTerm, page, pageSize);
            if (response.status && response.data) {
                setCategories(response.data);
            } else {
                setError(response.message || 'Error desconocido');
            }
        } catch (err) {
            setError('Error al cargar categorías');
        } finally {
            setLoading(false);
        }
    };

    const fetchProductCategories = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getProductCategoriesAction();
            if (response.status && response.data) {
                setCategories(response.data);
            } else {
                setError(response.message || 'Error desconocido');
            }
        } catch (err) {
            setError('Error al cargar categorías de productos');
        } finally {
            setLoading(false);
        }
    };

    const fetchCategoryById = async (id: number) => {
        setLoading(true);
        setError(null);
        try {
            const response = await getCategoryByIdAction(id);
            if (response.status && response.data) {
                return response.data;
            } else {
                setError(response.message || 'Error desconocido');
                return null;
            }
        } catch (err) {
            setError('Error al cargar categoría');
            return null;
        } finally {
            setLoading(false);
        }
    };

    const createCategory = async (category: CategoryCreateModel) => {
        setLoading(true);
        setError(null);
        try {
            const response = await createCategoryAction(category);
            if (response.status) {
                await fetchCategories(); // Recargar lista
                return true;
            } else {
                setError(response.message || 'Error desconocido');
                return false;
            }
        } catch (err) {
            setError('Error al crear categoría');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const updateCategory = async (id: number, category: CategoryEditModel) => {
        setLoading(true);
        setError(null);
        try {
            const response = await updateCategoryAction(id, category);
            if (response.status) {
                await fetchCategories(); // Recargar lista
                return true;
            } else {
                setError(response.message || 'Error desconocido');
                return false;
            }
        } catch (err) {
            setError('Error al actualizar categoría');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const deleteCategory = async (id: number) => {
        setLoading(true);
        setError(null);
        try {
            const response = await deleteCategoryAction(id);
            // Para eliminación, consideramos éxito si no hay error específico
            // ya que algunos endpoints pueden devolver status false pero eliminar correctamente
            if (response.status || response.statusCode === 200 || response.statusCode === 204) {
                // Actualizar la lista localmente sin hacer otra llamada
                setCategories(prevCategories => prevCategories.filter(cat => cat.id !== id));
                return true;
            } else {
                setError(response.message || 'Error al eliminar categoría');
                return false;
            }
        } catch (err) {
            setError('Error al eliminar categoría');
            return false;
        } finally {
            setLoading(false);
        }
    };

    return {
        categories,
        loading,
        error,
        fetchCategories,
        fetchProductCategories,
        fetchCategoryById,
        createCategory,
        updateCategory,
        deleteCategory
    };
}; 