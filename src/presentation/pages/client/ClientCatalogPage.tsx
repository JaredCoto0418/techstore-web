import { useState, useEffect } from 'react';
import { useProducts } from '../../hooks/useProducts';
import { useOrders } from '../../hooks/useOrders';
import { useAuthStore } from '../../stores/authStore';
import { Role } from '../../../infrastructure/enums/role.enum';
import { ProductImage } from '../../components/shared/ProductImage';


export const ClientCatalogPage = () => {
    const { products, loading: productsLoading, fetchProductCatalog } = useProducts();
    const { createOrder } = useOrders();
    const { authenticated, roles, token } = useAuthStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [showOrderModal, setShowOrderModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState<any>(null);
    const [orderQuantity, setOrderQuantity] = useState(1);

    const isClient = roles?.includes(Role.CLIENTE);

    useEffect(() => {
        // Cargar productos del catálogo público
        fetchProductCatalog();
    }, []);

    // Función para obtener el UserId del token JWT
    const getUserIdFromToken = () => {
        if (!token) return '';
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const userId = payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];
            return userId || '';
        } catch {
            return '';
        }
    };

    const handleOrder = (item: any) => {
        if (!authenticated) {
            alert('Debes iniciar sesión para realizar pedidos. Serás redirigido a la página de login.');
            window.location.href = '/login';
            return;
        }

        // Validar stock
        if (item.stock <= 0) {
            alert('Lo sentimos, este producto está agotado.');
            return;
        }

        setSelectedItem(item);
        setOrderQuantity(1);
        setShowOrderModal(true);
    };

    const handleCreateOrder = async () => {
        if (!selectedItem) return;

        const userId = getUserIdFromToken();
        if (!userId) {
            alert('Error: No se pudo obtener el ID del usuario. Por favor, inicie sesión nuevamente.');
            return;
        }

        const orderData = {
            userId: userId,
            orderDetails: [{
                productId: selectedItem.id,
                quantity: orderQuantity
            }]
        };

        const success = await createOrder(orderData);
        if (success) {
            setShowOrderModal(false);
            setSelectedItem(null);
            alert('Orden creada exitosamente. Serás redirigido a tus órdenes.');
            // Redirigir a Mis Órdenes después de crear la orden
            window.location.href = '/client/orders';
        }
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
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Catálogo</h1>
                <p className="text-gray-600">Explora nuestros productos</p>
                {authenticated && isClient && (
                    <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-green-800">
                            <strong>¡Bienvenido!</strong> Puedes hacer pedidos directamente desde aquí.
                            Revisa tus órdenes en <a href="/client/orders" className="text-green-600 hover:text-green-800 underline">Mis Órdenes</a>.
                        </p>
                    </div>
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
                                    onClick={() => handleOrder(product)}
                                    className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
                                >
                                    Comprar
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

            {/* Modal de Orden */}
            {showOrderModal && selectedItem && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <div className="mt-3">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Crear Orden</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Producto</label>
                                    <input
                                        type="text"
                                        value={selectedItem.name}
                                        disabled
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 text-gray-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Precio Unitario</label>
                                    <input
                                        type="text"
                                        value={`$${selectedItem.price}`}
                                        disabled
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 text-gray-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Cantidad</label>
                                    <input
                                        type="number"
                                        min="1"
                                        max={selectedItem.stock}
                                        value={orderQuantity}
                                        onChange={(e) => {
                                            const value = parseInt(e.target.value) || 1;
                                            setOrderQuantity(Math.max(1, Math.min(value, selectedItem.stock)));
                                        }}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                    <p className="mt-1 text-sm text-gray-500">Stock disponible: {selectedItem.stock}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Total</label>
                                    <input
                                        type="text"
                                        value={`$${(selectedItem.price * orderQuantity).toFixed(2)}`}
                                        disabled
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 text-gray-500 font-bold"
                                    />
                                </div>
                                <div className="flex justify-end space-x-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowOrderModal(false)}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        onClick={handleCreateOrder}
                                        disabled={orderQuantity < 1 || orderQuantity > selectedItem.stock}
                                        className={`px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md ${
                                            (orderQuantity < 1 || orderQuantity > selectedItem.stock)
                                                ? 'bg-gray-400 cursor-not-allowed'
                                                : 'bg-indigo-600 hover:bg-indigo-700'
                                        }`}
                                    >
                                        Crear Orden
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
