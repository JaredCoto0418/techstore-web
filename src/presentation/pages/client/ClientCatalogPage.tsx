import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useProducts } from '../../hooks/useProducts';
import { useAuthStore } from '../../stores/authStore';
import { useCartStore } from '../../stores/cartStore';
import { Role } from '../../../infrastructure/enums/role.enum';
import { ProductImage } from '../../components/shared/ProductImage';


export const ClientCatalogPage = () => {
    const { products, loading: productsLoading, fetchProductCatalog } = useProducts();
    const { authenticated, roles } = useAuthStore();
    const { addItem, totalItems } = useCartStore();
    const [searchTerm, setSearchTerm] = useState('');

    const isClient = roles?.includes(Role.CLIENTE);

    useEffect(() => {
        fetchProductCatalog();
    }, []);

    const handleAddToCart = (product: any) => {
        if (product.stock <= 0) {
            toast.error('Lo sentimos, este producto está agotado.');
            return;
        }
        addItem({
            productId: product.id,
            name: product.name,
            price: product.price,
            stock: product.stock,
            imageUrl: product.imageUrl
        });
        toast.success(`${product.name} agregado al carrito.`);
    };

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
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Catálogo</h1>
                    <p className="text-gray-600">Explora nuestros productos y agrégalos al carrito</p>
                </div>
                {authenticated && isClient && (
                    <Link
                        to="/cart"
                        className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                        🛒 Ver carrito ({totalItems()})
                    </Link>
                )}
            </div>

            {/* Search */}
            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Buscar productos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
            </div>

            {/* Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                    <div key={product.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                        <ProductImage
                            imageUrl={product.imageUrl}
                            productName={product.name}
                            size="md"
                            className="w-full"
                        />
                        <div className="p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
                            <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-2xl font-bold text-indigo-600">${product.price}</span>
                                <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">
                                    Stock: {product.stock}
                                </span>
                            </div>
                            <div className="text-sm text-gray-500 mb-4 space-y-1">
                                <p className="flex items-center">📂 {product.categoryName}</p>
                                <p className="flex items-center">👤 {product.sellerName}</p>
                            </div>
                            {!authenticated ? (
                                <button
                                    onClick={() => window.location.href = '/login'}
                                    className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
                                >
                                    Iniciar sesión para comprar
                                </button>
                            ) : !isClient ? (
                                <button
                                    disabled
                                    className="w-full bg-gray-400 text-white py-2 px-4 rounded-lg cursor-not-allowed"
                                >
                                    Solo clientes pueden comprar
                                </button>
                            ) : product.stock <= 0 ? (
                                <button
                                    disabled
                                    className="w-full bg-red-400 text-white py-2 px-4 rounded-lg cursor-not-allowed"
                                >
                                    Agotado
                                </button>
                            ) : (
                                <button
                                    onClick={() => handleAddToCart(product)}
                                    className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
                                >
                                    Agregar al carrito
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {filteredProducts.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-gray-500">No se encontraron productos.</p>
                </div>
            )}
        </div>
    );
};
