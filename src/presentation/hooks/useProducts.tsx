import { useState } from 'react';
import type { ProductResponse } from '../../infrastructure/interfaces/product.response';
import type { ProductCreateModel, ProductEditModel } from '../../core/models/product.model';
import { getProductsAction, getProductByIdAction, createProductAction, createProductWithImageAction, updateProductAction, updateProductWithImageAction, deleteProductAction, getProductCatalogAction, getMyProductsAction } from '../../core/actions/products/products.actions';

export const useProducts = () => {
    const [products, setProducts] = useState<ProductResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchProducts = async (searchTerm = "", page = 1, pageSize = 0) => {
        setLoading(true);
        setError(null);
        try {
            const response = await getProductsAction(searchTerm, page, pageSize);
            if (response.status && response.data) {
                setProducts(response.data);
            } else {
                setError(response.message || 'Error desconocido');
            }
        } catch (err) {
            setError('Error al cargar productos');
        } finally {
            setLoading(false);
        }
    };

    const fetchMyProducts = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getMyProductsAction();
            if (response.status && response.data) {
                setProducts(response.data);
            } else {
                setError(response.message || 'Error desconocido');
            }
        } catch (err) {
            setError('Error al cargar mis productos');
        } finally {
            setLoading(false);
        }
    };

    const fetchProductCatalog = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getProductCatalogAction();
            if (response.status && response.data) {
                setProducts(response.data);
            } else {
                setError(response.message || 'Error desconocido');
            }
        } catch (err) {
            setError('Error al cargar catálogo de productos');
        } finally {
            setLoading(false);
        }
    };

    const fetchProductById = async (id: number) => {
        setLoading(true);
        setError(null);
        try {
            const response = await getProductByIdAction(id);
            if (response.status && response.data) {
                return response.data;
            } else {
                setError(response.message || 'Error desconocido');
                return null;
            }
        } catch (err) {
            setError('Error al cargar producto');
            return null;
        } finally {
            setLoading(false);
        }
    };

    const createProduct = async (product: ProductCreateModel) => {
        setLoading(true);
        setError(null);
        try {
            const response = await createProductAction(product);
            if (response.status) {
                // No recargar automáticamente, el componente debe decidir qué función usar
                return true;
            } else {
                setError(response.message || 'Error desconocido');
                return false;
            }
        } catch (err) {
            setError('Error al crear producto');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const createProductWithImage = async (product: ProductCreateModel, imageFile?: File) => {
        setLoading(true);
        setError(null);
        try {
            const response = await createProductWithImageAction(product, imageFile);
            if (response.status) {
                // No recargar automáticamente, el componente debe decidir qué función usar
                return true;
            } else {
                setError(response.message || 'Error desconocido');
                return false;
            }
        } catch (err) {
            setError('Error al crear producto con imagen');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const updateProduct = async (id: number, product: ProductEditModel) => {
        setLoading(true);
        setError(null);
        try {
            const response = await updateProductAction(id, product);
            if (response.status) {
                // No recargar automáticamente, el componente debe decidir qué función usar
                return true;
            } else {
                setError(response.message || 'Error desconocido');
                return false;
            }
        } catch (err) {
            setError('Error al actualizar producto');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const updateProductWithImage = async (id: number, product: ProductEditModel, imageFile?: File) => {
        setLoading(true);
        setError(null);
        try {
            const response = await updateProductWithImageAction(id, product, imageFile);
            if (response.status) {
                // No recargar automáticamente, el componente debe decidir qué función usar
                return true;
            } else {
                setError(response.message || 'Error desconocido');
                return false;
            }
        } catch (err) {
            setError('Error al actualizar producto con imagen');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const deleteProduct = async (id: number) => {
        setLoading(true);
        setError(null);
        try {
            const response = await deleteProductAction(id);
            // Para eliminación, consideramos éxito si no hay error específico
            // ya que algunos endpoints pueden devolver status false pero eliminar correctamente
            if (response.status || response.statusCode === 200 || response.statusCode === 204) {
                // Actualizar la lista localmente sin hacer otra llamada
                setProducts(prevProducts => prevProducts.filter(product => product.id !== id));
                return true;
            } else {
                setError(response.message || 'Error al eliminar producto');
                return false;
            }
        } catch (err) {
            setError('Error al eliminar producto');
            return false;
        } finally {
            setLoading(false);
        }
    };

    return {
        products,
        loading,
        error,
        fetchProducts,
        fetchMyProducts,
        fetchProductCatalog,
        fetchProductById,
        createProduct,
        createProductWithImage,
        updateProduct,
        updateProductWithImage,
        deleteProduct
    };
}; 