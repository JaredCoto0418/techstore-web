import { useState } from 'react';
import type { OrderResponse } from '../../infrastructure/interfaces/order.response';
import type { OrderCreateModel, OrderEditModel, OrderStatusUpdateModel } from '../../core/models/order.model';
import { getOrdersAction, getOrderByIdAction, createOrderAction, updateOrderAction, deleteOrderAction, getMyOrdersAction } from '../../core/actions/orders/orders.actions';
import { updateOrderStatus as updateOrderStatusApi } from '../../core/api/orders.api';
import { useAuthStore } from '../stores/authStore';

export const useOrders = () => {
    const [orders, setOrders] = useState<OrderResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { roles } = useAuthStore();

    const fetchOrders = async (searchTerm = "", page = 1, pageSize = 0) => {
        setLoading(true);
        setError(null);
        try {
            const response = await getOrdersAction(searchTerm, page, pageSize, roles);
            if (response.status && response.data) {
                setOrders(response.data);
            } else {
                setError(response.message || 'Error desconocido');
            }
        } catch (err) {
            setError('Error al cargar órdenes');
        } finally {
            setLoading(false);
        }
    };

    const fetchMyOrders = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getMyOrdersAction();
            if (response.status && response.data) {
                setOrders(response.data);
            } else {
                setError(response.message || 'Error desconocido');
            }
        } catch (err) {
            setError('Error al cargar mis órdenes');
        } finally {
            setLoading(false);
        }
    };

    const fetchOrderById = async (id: number) => {
        setLoading(true);
        setError(null);
        try {
            const response = await getOrderByIdAction(id);
            if (response.status && response.data) {
                return response.data;
            } else {
                setError(response.message || 'Error desconocido');
                return null;
            }
        } catch (err) {
            setError('Error al cargar orden');
            return null;
        } finally {
            setLoading(false);
        }
    };

    const createOrder = async (order: OrderCreateModel) => {
        setLoading(true);
        setError(null);
        try {
            const response = await createOrderAction(order);
            if (response.status) {
                await fetchMyOrders(); // Recargar lista usando fetchMyOrders
                return true;
            } else {
                setError(response.message || 'Error desconocido');
                return false;
            }
        } catch (err) {
            setError('Error al crear orden');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const updateOrder = async (id: number, order: OrderEditModel) => {
        setLoading(true);
        setError(null);
        try {
            const response = await updateOrderAction(id, order);
            if (response.status) {
                await fetchMyOrders(); // Recargar lista usando fetchMyOrders
                return true;
            } else {
                setError(response.message || 'Error desconocido');
                return false;
            }
        } catch (err) {
            setError('Error al actualizar orden');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const deleteOrder = async (id: number) => {
        setLoading(true);
        setError(null);
        try {
            const response = await deleteOrderAction(id);
            // Para eliminación, consideramos éxito si no hay error específico
            // ya que algunos endpoints pueden devolver status false pero eliminar correctamente
            if (response.status || response.statusCode === 200 || response.statusCode === 204) {
                // Actualizar la lista localmente sin hacer otra llamada
                setOrders(prevOrders => prevOrders.filter(order => order.id !== id));
                return true;
            } else {
                setError(response.message || 'Error al eliminar orden');
                return false;
            }
        } catch (err) {
            setError('Error al eliminar orden');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const updateOrderStatus = async (id: number, statusUpdate: OrderStatusUpdateModel) => {
        setLoading(true);
        setError(null);
        try {
            const response = await updateOrderStatusApi(id, statusUpdate);
            if (response.status) {
                await fetchMyOrders(); // Recargar lista usando fetchMyOrders
                return true;
            } else {
                setError(response.message || 'Error desconocido');
                return false;
            }
        } catch (err) {
            setError('Error al actualizar estado de la orden');
            return false;
        } finally {
            setLoading(false);
        }
    };

    return {
        orders,
        loading,
        error,
        fetchOrders,
        fetchMyOrders,
        fetchOrderById,
        createOrder,
        updateOrder,
        updateOrderStatus,
        deleteOrder
    };
}; 