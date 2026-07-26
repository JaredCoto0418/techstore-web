import { useState, useEffect } from 'react';
import { useOrders } from '../../hooks/useOrders';
import { useAuthStore } from '../../stores/authStore';
import { Role } from '../../../infrastructure/enums/role.enum';
import type { OrderStatusUpdateModel } from '../../../core/models/order.model';

export const VendorOrdersPage = () => {
    const { orders, loading, fetchMyOrders, updateOrderStatus } = useOrders();
    const { authenticated, roles } = useAuthStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<any>(null);
    const [newStatus, setNewStatus] = useState('');

    const isVendor = roles?.includes(Role.VENDEDOR);

    useEffect(() => {
        if (authenticated && isVendor) {
            fetchMyOrders();
        }
    }, [authenticated, isVendor]);

    const handleUpdateOrderStatus = async () => {
        if (!selectedOrder || !newStatus) return;
        
        // Confirmación especial para cancelar
        if (newStatus.toUpperCase() === 'CANCELADA') {
            const confirmed = window.confirm(
                '¿Estás seguro de que quieres cancelar esta orden? ' +
                'La orden se eliminará y el stock se reembolsará automáticamente.'
            );
            if (!confirmed) return;
        }

        // Confirmación especial para completar
        if (newStatus.toUpperCase() === 'COMPLETADA') {
            const confirmed = window.confirm(
                '¿Estás seguro de que quieres marcar esta orden como completada? ' +
                'Una vez completada, no podrás modificar su estado.'
            );
            if (!confirmed) return;
        }

        const statusUpdate: OrderStatusUpdateModel = { status: newStatus };
        const success = await updateOrderStatus(selectedOrder.id, statusUpdate);
        
        if (success) {
            setShowStatusModal(false);
            setSelectedOrder(null);
            setNewStatus('');
        }
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'pendiente':
                return 'bg-yellow-100 text-yellow-800';
            case 'en_proceso':
                return 'bg-blue-100 text-blue-800';
            case 'completada':
                return 'bg-green-100 text-green-800';
            case 'cancelada':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    // Aplicar filtros de búsqueda y estado (ya no necesitamos filtrar por vendedor porque el backend lo hace)
    const filteredOrders = orders.filter(order => {
        const matchesSearch = order.id.toString().includes(searchTerm) ||
            order.userId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.orderDetails?.some((detail: any) => 
                detail.productName?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        
        const matchesStatus = statusFilter === 'ALL' || order.status === statusFilter;
        
        return matchesSearch && matchesStatus;
    });



    if (!authenticated || !isVendor) {
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
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Órdenes de Mis Productos</h1>
                <p className="text-gray-600">Gestiona las órdenes de los productos que vendes</p>
            </div>

            {/* Controles de filtrado */}
            <div className="mb-6 flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                    <input
                        type="text"
                        placeholder="Buscar por ID, cliente o producto..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                </div>
                <div className="sm:w-48">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                        <option value="ALL">Todos los estados</option>
                        <option value="PENDIENTE">Pendiente</option>
                        <option value="EN PROCESO">En Proceso</option>
                        <option value="COMPLETADA">Completada</option>
                        <option value="CANCELADA">Cancelada</option>
                    </select>
                </div>
            </div>

            {/* Tabla de órdenes */}
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                ID
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Cliente
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Productos
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Total
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Estado
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Acciones
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredOrders.map((order) => (
                            <tr key={order.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    #{order.id}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {order.userId || 'N/A'}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-900">
                                    <div className="max-w-xs">
                                        {order.orderDetails
                                            ?.filter((detail: any) => detail.productId) // Solo productos
                                            .map((detail: any, index: number) => (
                                                <div key={index} className="mb-1">
                                                    <span className="font-medium">{detail.productName}</span>
                                                    <span className="text-gray-500 ml-2">x{detail.quantity}</span>
                                                </div>
                                            ))
                                        }
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    ${order.totalAmount?.toFixed(2)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    {order.status === 'CANCELADA' || order.status === 'COMPLETADA' ? (
                                        <span className="text-gray-400 cursor-not-allowed">
                                            No editable
                                        </span>
                                    ) : (
                                        <button
                                            onClick={() => {
                                                setSelectedOrder(order);
                                                setShowStatusModal(true);
                                            }}
                                            className="text-indigo-600 hover:text-indigo-900 mr-4"
                                        >
                                            Cambiar Estado
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {filteredOrders.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">
                        No hay órdenes que coincidan con los filtros aplicados.
                    </p>
                </div>
            )}

            {/* Modal para cambiar estado */}
            {showStatusModal && selectedOrder && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <div className="mt-3">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">
                                Cambiar Estado de Orden #{selectedOrder.id}
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Estado Actual: <span className="font-bold">{selectedOrder.status}</span>
                                    </label>
                                    <select
                                        value={newStatus}
                                        onChange={(e) => setNewStatus(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    >
                                        <option value="">Seleccionar nuevo estado...</option>
                                        <option value="PENDIENTE">PENDIENTE</option>
                                        <option value="EN PROCESO">EN PROCESO</option>
                                        <option value="COMPLETADA">COMPLETADA</option>
                                        <option value="CANCELADA">CANCELADA</option>
                                    </select>
                                </div>
                                <div className="flex justify-end space-x-3">
                                    <button
                                        onClick={() => {
                                            setShowStatusModal(false);
                                            setSelectedOrder(null);
                                            setNewStatus('');
                                        }}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        onClick={handleUpdateOrderStatus}
                                        disabled={!newStatus}
                                        className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                                    >
                                        Actualizar
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