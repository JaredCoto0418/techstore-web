import { useState, useEffect } from 'react';
import { useProducts } from '../../hooks/useProducts';
import { Link } from 'react-router-dom';
import { ProductCard } from '../../components/shared/ProductCard';

export const PublicCatalogPage = () => {
    const { products, loading: productsLoading, fetchProductCatalog } = useProducts();
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        // Cargar productos del catálogo público
        fetchProductCatalog();
    }, []);

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.categoryName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (productsLoading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50">
            {/* Header público */}
            <header className="bg-white shadow-sm">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold text-gray-900">TechStore</h1>
                        <div className="space-x-4">
                            <Link
                                to="/login"
                                className="text-indigo-600 hover:text-indigo-700 font-medium"
                            >
                                Iniciar Sesión
                            </Link>
                            <Link
                                to="/register"
                                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                            >
                                Registrarse
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Catálogo</h2>
                    <p className="text-gray-600">Explora nuestros productos</p>
                    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-blue-800">
                            <strong>¿Quieres hacer un pedido?</strong>
                            <Link to="/login" className="text-blue-600 hover:text-blue-800 underline ml-1">Inicia sesión</Link> o{' '}
                            <Link to="/register" className="text-blue-600 hover:text-blue-800 underline">créa una cuenta</Link> para comenzar.
                        </p>
                    </div>
                </div>

                {/* Buscador */}
                <div className="mb-6">
                    <input
                        type="text"
                        placeholder="Buscar productos..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                </div>

                {/* Contenido de Productos */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredProducts.map((product) => (
                        <ProductCard key={product.id} product={product}>
                            <div className="text-center">
                                <Link
                                    to="/login"
                                    className="w-full bg-indigo-600 text-white px-4 py-3 rounded-lg hover:bg-indigo-700 transition-colors duration-200 font-medium"
                                >
                                    Iniciar sesión para comprar
                                </Link>
                            </div>
                        </ProductCard>
                    ))}
                </div>

                {/* Mensaje si no hay resultados */}
                {filteredProducts.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">
                            No se encontraron productos que coincidan con tu búsqueda.
                        </p>
                    </div>
                )}
            </div>

            {/* Footer */}
            <footer className="bg-gray-800 text-white py-8 mt-16">
                <div className="container mx-auto px-4 text-center">
                    <p>&copy; 2024 TechStore. Todos los derechos reservados.</p>
                </div>
            </footer>
        </div>
    );
};
