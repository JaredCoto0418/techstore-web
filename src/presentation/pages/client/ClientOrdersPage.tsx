import React, { useEffect, useState } from 'react';
import { useProducts } from '../../hooks/useProducts';
import { useOrders } from '../../hooks/useOrders';
import { useAuthStore } from '../../stores/authStore';
import type { OrderResponse } from '../../../infrastructure/interfaces/order.response';
import { Link } from 'react-router-dom';

export const ClientOrdersPage = () => {
    const { orders, loading, error, fetchMyOrders, createOrder } = useOrders();
    const [selectedOrder, setSelectedOrder] = useState<OrderResponse | null>(null);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
    const [orderQuantity, setOrderQuantity] = useState(1);
    const { products, fetchProductCatalog } = useProducts();
    const { token } = useAuthStore();

    useEffect(() => {
        fetchMyOrders();
        fetchProductCatalog();
    }, []);

    // Obtener userId del token
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

    // Obtener el producto seleccionado
    const selectedProduct = products.find((p: any) => p.id === selectedItemId);
    const unitPrice = selectedProduct?.price || 0;
    const total = unitPrice * orderQuantity;

    const handleCreateOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        const userId = getUserIdFromToken();
        if (!userId || !selectedProduct) return;

        // Validar stock
        if (selectedProduct.stock <= 0) {
            alert('No se puede crear la orden: El producto seleccionado no tiene stock disponible.');
            return;
        }

        if (selectedProduct.stock < orderQuantity) {
            alert(`No se puede crear la orden: Solo hay ${selectedProduct.stock} unidades disponibles, pero solicitaste ${orderQuantity}.`);
            return;
        }

        const orderDetail = {
            productId: selectedProduct.id,
            quantity: orderQuantity
        };

        const orderData = {
            userId: userId,
            orderDetails: [orderDetail]
        };
        
        const success = await createOrder(orderData);
        if (success) {
            setShowCreateForm(false);
            setSelectedItemId(null);
            setOrderQuantity(1);
            alert('Orden creada exitosamente. La página se actualizará automáticamente.');
            // Refrescar lista
            await fetchMyOrders();
        }
    };

    const getStatusColor = (status: string) => {
        switch (status.toUpperCase()) {
            case 'PENDIENTE': return 'bg-yellow-100 text-yellow-800';
            case 'EN PROCESO': return 'bg-blue-100 text-blue-800';
            case 'COMPLETADA': return 'bg-green-100 text-green-800';
            case 'CANCELADA': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                {/* Header mejorado */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Mis Órdenes</h1>
                            <p className="text-gray-600">Gestiona tus pedidos</p>
                        </div>
                        <div className="mt-4 sm:mt-0 space-y-2 sm:space-y-0 sm:space-x-3 sm:flex">
                            <Link 
                                to="/catalog" 
                                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                Volver al Catálogo
                            </Link>
                            <button
                                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                onClick={() => setShowCreateForm(true)}
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                Crear Nueva Orden
                            </button>
                        </div>
                    </div>
                </div>

            {showCreateForm && (
                <div className="bg-white rounded-lg shadow-sm p-6 mb-8 max-w-lg mx-auto">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-900">Crear Nueva Orden</h2>
                        <button
                            onClick={() => setShowCreateForm(false)}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    
                    <form onSubmit={handleCreateOrder} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Seleccionar Producto
                            </label>
                            <select
                                value={selectedItemId ?? ''}
                                onChange={e => setSelectedItemId(Number(e.target.value) || null)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                required
                            >
                                <option value="">Seleccionar...</option>
                                {products.map((item: any) => (
                                    <option
                                        key={item.id}
                                        value={item.id}
                                        disabled={item.stock <= 0}
                                    >
                                        {item.name} - ${item.price}
                                        {item.stock <= 0 && ' (Sin stock)'}
                                        {item.stock > 0 && ` (Stock: ${item.stock})`}
                                    </option>
                                ))}
                            </select>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Cantidad</label>
                            <input
                                type="number"
                                min="1"
                                value={orderQuantity}
                                onChange={e => setOrderQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                required
                            />
                        </div>
                        
                        <div className="bg-gray-50 rounded-lg p-4">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-gray-700">Total Estimado:</span>
                                <span className="text-2xl font-bold text-gray-900">${total.toFixed(2)}</span>
                            </div>
                        </div>
                        
                        <div className="flex justify-end space-x-3 pt-4">
                            <button
                                type="button"
                                onClick={() => setShowCreateForm(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={!selectedItemId || orderQuantity < 1}
                                className={`px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                                    !selectedItemId || orderQuantity < 1 
                                        ? 'bg-gray-400 cursor-not-allowed' 
                                        : 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500'
                                }`}
                            >
                                Crear Orden
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {loading ? (
                <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Cargando tus órdenes...</p>
                </div>
            ) : error ? (
                <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                    <div className="text-red-600 mb-4">
                        <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <p className="text-red-600 font-medium">{error}</p>
                </div>
            ) : orders.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                    <div className="text-gray-400 mb-4">
                        <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No tienes órdenes registradas</h3>
                    <p className="text-gray-600">Comienza explorando nuestro catálogo y crea tu primera orden</p>
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-medium text-gray-900">Historial de Órdenes</h2>
                        <p className="text-sm text-gray-600 mt-1">Total: {orders.length} orden{orders.length !== 1 ? 'es' : ''}</p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Detalles</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {orders.map(order => (
                                    <tr key={order.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            #{order.id}
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                                            ${order.totalAmount.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900">
                                            <div className="max-w-xs">
                                                {order.orderDetails.map(detail => (
                                                    <div key={detail.id} className="mb-1">
                                                        <span className="font-medium">{detail.productName}</span>
                                                        <span className="text-gray-500 ml-2">x{detail.quantity}</span>
                                                        <span className="text-gray-400 ml-2">@ ${detail.unitPrice.toFixed(2)}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <button
                                                className="text-indigo-600 hover:text-indigo-900 font-medium"
                                                onClick={() => setSelectedOrder(order)}
                                            >
                                                Ver Detalles
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Modal de detalles */}
            {selectedOrder && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-full max-w-lg shadow-lg rounded-md bg-white">
                        <div className="mt-3">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-gray-900">Orden #{selectedOrder.id}</h3>
                                <button
                                    onClick={() => setSelectedOrder(null)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            
                            <div className="space-y-4">
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <div className="grid grid-cols-2 gap-4 text-sm">

                                        <div>
                                            <span className="font-medium text-gray-700">Estado:</span>
                                            <p><span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedOrder.status)}`}>
                                                {selectedOrder.status}
                                            </span></p>
                                        </div>
                                        <div className="col-span-2">
                                            <span className="font-medium text-gray-700">Total:</span>
                                            <p className="text-2xl font-bold text-gray-900">${selectedOrder.totalAmount.toFixed(2)}</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div>
                                    <h4 className="font-medium text-gray-900 mb-3">Detalles del Pedido</h4>
                                    <div className="space-y-3">
                                        {selectedOrder.orderDetails.map(detail => (
                                            <div key={detail.id} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
                                                <div>
                                                    <p className="font-medium text-gray-900">{detail.productName}</p>
                                                    <p className="text-sm text-gray-600">Cantidad: {detail.quantity}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-medium text-gray-900">${detail.unitPrice.toFixed(2)}</p>
                                                    <p className="text-sm text-gray-600">c/u</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex justify-end mt-6">
                                <button
                                    type="button"
                                    onClick={() => setSelectedOrder(null)}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                                >
                                    Cerrar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            </div>
        </div>
    );
}; 