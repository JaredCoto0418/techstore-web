import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import toast from 'react-hot-toast';
import { useOrders } from '../../hooks/useOrders';
import { createPayPalOrderAction, capturePaymentAction } from '../../../core/actions/payments/payments.actions';
import { formatCurrency } from '../../../core/utils/format.util';
import type { OrderResponse, OrderDetailResponse } from '../../../infrastructure/interfaces/order.response';

export const CheckoutPage = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const { fetchOrderById } = useOrders();
    const numericOrderId = Number(orderId);

    const [order, setOrder] = useState<OrderResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);

    const clientId = import.meta.env.VITE_PAYPAL_CLIENT_ID as string;

    useEffect(() => {
        (async () => {
            const data = await fetchOrderById(numericOrderId);
            setOrder(data);
            setLoading(false);
        })();
    }, [orderId]);

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="container mx-auto px-4 py-12 text-center">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Orden no encontrada</h1>
                <Link to="/client/orders" className="text-indigo-600 hover:underline">Volver a Mis Órdenes</Link>
            </div>
        );
    }

    const yaPagada = (order.status || '').toUpperCase() === 'PAGADA';

    return (
        <div className="container mx-auto px-4 py-8 max-w-lg">
            <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Pagar Orden #{order.id}</h1>
                    <Link to="/client/orders" className="text-sm text-indigo-600 hover:underline">Volver</Link>
                </div>

                {/* Resumen */}
                <div className="border border-gray-200 rounded-lg p-4 mb-6">
                    <div className="space-y-2">
                        {order.orderDetails?.map((d: OrderDetailResponse) => (
                            <div key={d.id} className="flex justify-between text-sm">
                                <span className="text-gray-700">{d.productName} x{d.quantity}</span>
                                <span className="text-gray-900">{formatCurrency(d.unitPrice * d.quantity)}</span>
                            </div>
                        ))}
                    </div>
                    <div className="border-t border-gray-200 mt-3 pt-3 flex justify-between">
                        <span className="font-semibold text-gray-900">Total</span>
                        <span className="font-bold text-indigo-600 text-lg">{formatCurrency(order.totalAmount, 'USD')}</span>
                    </div>
                </div>

                {yaPagada ? (
                    <div className="text-center py-4">
                        <p className="text-green-700 font-medium mb-3">✅ Esta orden ya fue pagada.</p>
                        <Link to="/client/transactions" className="text-indigo-600 hover:underline">Ver mi historial de pagos</Link>
                    </div>
                ) : !clientId ? (
                    <p className="text-red-600 text-sm text-center">Falta configurar el Client ID de PayPal.</p>
                ) : (
                    <PayPalScriptProvider options={{ clientId: clientId, currency: 'USD', intent: 'capture' }}>
                        <PayPalButtons
                            style={{ layout: 'vertical', color: 'gold', shape: 'rect', label: 'paypal' }}
                            disabled={processing}
                            createOrder={async () => {
                                const res = await createPayPalOrderAction(numericOrderId);
                                if (res.status && res.data?.paypalOrderId) {
                                    return res.data.paypalOrderId;
                                }
                                toast.error(res.message || 'No se pudo iniciar el pago.');
                                throw new Error('create-order failed');
                            }}
                            onApprove={async (data) => {
                                setProcessing(true);
                                const res = await capturePaymentAction(numericOrderId, data.orderID as string);
                                setProcessing(false);
                                if (res.status) {
                                    toast.success('¡Pago completado exitosamente!');
                                    navigate('/client/transactions');
                                } else {
                                    toast.error(res.message || 'El pago fue rechazado.');
                                    navigate('/client/orders');
                                }
                            }}
                            onCancel={() => toast('Pago cancelado.')}
                            onError={() => toast.error('Ocurrió un error con PayPal.')}
                        />
                    </PayPalScriptProvider>
                )}
            </div>
        </div>
    );
};
