interface StatusBadgeProps {
    status: string;
}

/** Devuelve las clases de color según el estado de una orden o transacción. */
const getStatusClasses = (status: string): string => {
    switch (status.toUpperCase().replace('_', ' ')) {
        case 'PENDIENTE':
            return 'bg-yellow-100 text-yellow-800';
        case 'EN PROCESO':
            return 'bg-blue-100 text-blue-800';
        case 'COMPLETADA':
        case 'PAGADA':
            return 'bg-green-100 text-green-800';
        case 'CANCELADA':
        case 'PAGO RECHAZADO':
            return 'bg-red-100 text-red-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
};

/** Badge de estado reutilizable (órdenes y transacciones). */
export const StatusBadge = ({ status }: StatusBadgeProps) => (
    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusClasses(status)}`}>
        {status}
    </span>
);
