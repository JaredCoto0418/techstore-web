import { useState, useEffect } from 'react';
import { useOrders } from '../../hooks/useOrders';
import { useAuthStore } from '../../stores/authStore';
import { Role } from '../../../infrastructure/enums/role.enum';
import type { OrderEditModel } from '../../../core/models/order.model';
import type { OrderResponse, OrderDetailResponse } from '../../../infrastructure/interfaces/order.response';
import { formatCurrency } from '../../../core/utils/format.util';
import { StatusBadge } from '../../components/shared/StatusBadge';

export const AdminOrdersPage = () => {
    const { orders, loading, fetchOrders, updateOrder, deleteOrder } = useOrders();
    const { authenticated, roles } = useAuthStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<OrderResponse | null>(null);
    const [editData, setEditData] = useState<OrderEditModel>({
        userId: '',
        totalAmount: 0,
        status: '',
        orderDetails: []
    });

    const isAdmin = roles?.includes(Role.ADMINISTRADOR);

    useEffect(() => {
        if (authenticated && isAdmin) {
            fetchOrders();
        }
    }, [authenticated, isAdmin]);

    const handleUpdateOrder = async () => {
        if (!selectedOrder) return;
        
        const success = await updateOrder(selectedOrder.id, editData);
        if (success) {
            setShowEditModal(false);
            setSelectedOrder(null);
            setEditData({
                userId: '',
                totalAmount: 0,
                status: '',
                orderDetails: []
            });
        }
    };

    const handleDeleteOrder = async (orderId: number) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar esta orden? Esta acción no se puede deshacer.')) {
            const success = await deleteOrder(orderId);
            if (success) {
                // La orden se eliminará automáticamente de la lista
            }
        }
    };


    const filteredOrders = orders.filter(order => {
        const matchesSearch = order.id.toString().includes(searchTerm) || 
                            order.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            order.userId?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'ALL' || order.status.toUpperCase() === statusFilter;
        return matchesSearch && matchesStatus;
    });

    if (!authenticated || !isAdmin) {
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
        <div className="container mx-auto px-4 py-8">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestión de Órdenes</h1>
                        <p className="text-gray-600">Administra todas las órdenes del sistema</p>
                    </div>
                </div>
            </div>

            {/* Filtros */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Buscar
                        </label>
                        <input
                            type="text"
                            placeholder="Buscar por ID, estado o usuario..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Filtrar por Estado
                        </label>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="ALL">Todos los estados</option>
                            <option value="PENDIENTE">Pendiente</option>
                            <option value="EN PROCESO">En Proceso</option>
                            <option value="COMPLETADA">Completada</option>
                            <option value="CANCELADA">Cancelada</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Tabla de órdenes */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-medium text-gray-900">Todas las Órdenes</h2>
                    <p className="text-sm text-gray-600 mt-1">Total: {filteredOrders.length} orden{filteredOrders.length !== 1 ? 'es' : ''}</p>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Detalles</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredOrders.map(order => (
                                <tr key={order.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        #{order.id}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {order.userId || 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900">
                                        <div className="max-w-xs">
                                            {order.orderDetails?.map((detail: OrderDetailResponse, index: number) => (
                                                <div key={index} className="mb-1">
                                                    <span className="font-medium">{detail.productName}</span>
                                                    <span className="text-gray-500 ml-2">x{detail.quantity}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                                        {formatCurrency(order.totalAmount)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <StatusBadge status={order.status} />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => {
                                                    setSelectedOrder(order);
                                                    setEditData({
                                                        userId: order.userId,
                                                        totalAmount: order.totalAmount,
                                                        status: order.status,
                                                        orderDetails: order.orderDetails.map((detail: OrderDetailResponse) => ({
                                                            id: detail.id,
                                                            productId: detail.productId,
                                                            quantity: detail.quantity,
                                                            unitPrice: detail.unitPrice
                                                        }))
                                                    });
                                                    setShowEditModal(true);
                                                }}
                                                className="text-indigo-600 hover:text-indigo-900"
                                            >
                                                Editar
                                            </button>
                                            <button
                                                onClick={() => handleDeleteOrder(order.id)}
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

            {filteredOrders.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">
                        No hay órdenes que coincidan con los filtros aplicados.
                    </p>
                </div>
            )}

            {/* Modal de edición completa */}
            {showEditModal && selectedOrder && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
                        <div className="mt-3">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-gray-900">Editar Orden #{selectedOrder.id}</h3>
                                <button
                                    onClick={() => {
                                        setShowEditModal(false);
                                        setSelectedOrder(null);
                                        setEditData({
                                            userId: '',
                                            totalAmount: 0,
                                            status: '',
                                            orderDetails: []
                                        });
                                    }}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Usuario ID</label>
                                        <input
                                            type="text"
                                            value={editData.userId}
                                            onChange={(e) => setEditData({...editData, userId: e.target.value})}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Total</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={editData.totalAmount}
                                            onChange={(e) => setEditData({...editData, totalAmount: parseFloat(e.target.value) || 0})}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        />
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
                                    <select
                                        value={editData.status}
                                        onChange={(e) => setEditData({...editData, status: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    >
                                        <option value="PENDIENTE">PENDIENTE</option>
                                        <option value="EN PROCESO">EN PROCESO</option>
                                        <option value="COMPLETADA">COMPLETADA</option>
                                        <option value="CANCELADA">CANCELADA</option>
                                    </select>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Detalles de la Orden</label>
                                    <div className="space-y-2">
                                        {editData.orderDetails.map((detail, index) => (
                                            <div key={index} className="flex items-center space-x-2 p-3 bg-gray-50 rounded-md">
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium">
                                                        Producto ID: {detail.productId}
                                                    </p>
                                                    <p className="text-xs text-gray-600">Cantidad: {detail.quantity} | Precio: ${detail.unitPrice}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex justify-end space-x-3 mt-6">
                                <button
                                    onClick={() => {
                                        setShowEditModal(false);
                                        setSelectedOrder(null);
                                        setEditData({
                                            userId: '',
                                            totalAmount: 0,
                                            status: '',
                                            orderDetails: []
                                        });
                                    }}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleUpdateOrder}
                                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Actualizar Orden
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}; 