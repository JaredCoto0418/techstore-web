import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useCartStore } from '../../stores/cartStore';
import { useAuthStore } from '../../stores/authStore';
import { useOrders } from '../../hooks/useOrders';
import { ProductImage } from '../../components/shared/ProductImage';

export const CartPage = () => {
    const { items, updateQuantity, removeItem, clearCart, totalAmount } = useCartStore();
    const { token } = useAuthStore();
    const { createOrder } = useOrders();
    const navigate = useNavigate();
    const [processing, setProcessing] = useState(false);

    const getUserIdFromToken = () => {
        if (!token) return '';
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] || '';
        } catch {
            return '';
        }
    };

    const handleChekout = async () => {
        const userId = getUserIdFromToken();
        if (!userId) {
            toast.error('No se pudo obtener el usuario. Inicia sesión nuevamente.');
            return;
        }
        if (items.length === 0) return;

        setProcessing(true);
        const orderData = {
            userId,
            orderDetails: items.map(i => ({ productId: i.productId, quantity: i.quantity }))
        };
        const success = await createOrder(orderData);
        setProcessing(false);

        if (success) {
            clearCart();
            toast.success('¡Pedido creado! Ahora puedes pagarlo desde Mis Órdenes.');
            navigate('/client/orders');
        } else {
            toast.error('No se pudo crear el pedido. Revisa el stock e intenta de nuevo.');
        }
    };

    return (
        <div className="bg-gray-50">
            <div className="container mx-auto px-4 py-8 max-w-3xl">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">Mi Carrito</h1>
                    <Link to="/catalog" className="text-sm text-indigo-600 hover:underline">← Seguir comprando</Link>
                </div>

                {items.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                        <div className="text-gray-400 mb-4">
                            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Tu carrito está vacío</h3>
                        <p className="text-gray-600 mb-4">Agrega productos desde el catálogo para empezar.</p>
                        <Link to="/catalog" className="inline-block bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">Ir al catálogo</Link>
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                        <ul className="divide-y divide-gray-200">
                            {items.map(item => (
                                <li key={item.productId} className="p-4 flex items-center gap-4">
                                    <ProductImage imageUrl={item.imageUrl} productName={item.name} size="sm" />
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-gray-900 truncate">{item.name}</p>
                                        <p className="text-sm text-gray-500">${item.price.toFixed(2)} c/u · stock {item.stock}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                                            className="w-8 h-8 rounded border border-gray-300 hover:bg-gray-100"
                                        >−</button>
                                        <span className="w-8 text-center">{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                            disabled={item.quantity >= item.stock}
                                            className="w-8 h-8 rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                                        >+</button>
                                    </div>
                                    <div className="w-24 text-right font-semibold text-gray-900">
                                        ${(item.price * item.quantity).toFixed(2)}
                                    </div>
                                    <button
                                        onClick={() => removeItem(item.productId)}
                                        className="text-red-500 hover:text-red-700 ml-2"
                                        title="Quitar"
                                    >✕</button>
                                </li>
                            ))}
                        </ul>

                        <div className="p-4 border-t border-gray-200 bg-gray-50">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-lg font-semibold text-gray-900">Total</span>
                                <span className="text-2xl font-bold text-indigo-600">${totalAmount().toFixed(2)} USD</span>
                            </div>
                            <div className="flex justify-between gap-3">
                                <button
                                    onClick={clearCart}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-100"
                                >
                                    Vaciar carrito
                                </button>
                                <button
                                    onClick={handleChekout}
                                    disabled={processing}
                                    className="flex-1 sm:flex-none px-6 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                                >
                                    {processing ? 'Creando pedido...' : 'Realizar pedido'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
