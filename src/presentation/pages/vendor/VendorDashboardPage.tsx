import { Link } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { Role } from '../../../infrastructure/enums/role.enum';

export const VendorDashboardPage = () => {
    const { authenticated, roles } = useAuthStore();

    const isVendor = roles?.includes(Role.VENDEDOR);

    if (!authenticated || !isVendor) {
        return (
            <div className="bg-gray-50 flex items-center justify-center py-12">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-red-600 mb-4">
                        Acceso Denegado
                    </h1>
                    <p className="text-gray-600">
                        No tienes permisos para acceder a esta página.
                    </p>
                </div>
            </div>
        );
    }

    const dashboardCards = [
        {
            title: 'Gestionar Productos',
            description: 'Administra tu inventario de productos',
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
            ),
            link: '/vendor/products',
            color: 'bg-blue-500'
        },
        {
            title: 'Mis Órdenes',
            description: 'Revisa órdenes de tus productos',
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
            ),
            link: '/vendor/orders',
            color: 'bg-green-500'
        },

    ];

    return (
        <div className="bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Panel de Vendedor</h1>
                            <p className="mt-1 text-sm text-gray-600">
                                Gestiona tus productos y ventas
                            </p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                Vendedor Activo
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Módulos principales */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Panel de Control</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {dashboardCards.map((card, index) => (
                            <Link
                                key={index}
                                to={card.link}
                                className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300 group"
                            >
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className={`p-3 rounded-lg ${card.color} text-white group-hover:scale-110 transition-transform duration-300`}>
                                            {card.icon}
                                        </div>
                                        <div className="text-right">
                                            <span className="text-lg font-bold text-indigo-600">Gestionar</span>
                                        </div>
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors duration-300">
                                        {card.title}
                                    </h3>
                                    <p className="text-gray-600 text-sm">
                                        {card.description}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Información útil */}
                <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Funciones de Vendedor
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-4 border border-blue-200 rounded-md bg-blue-50">
                            <h4 className="font-medium text-blue-900 mb-2">📦 Productos</h4>
                            <p className="text-sm text-blue-800">
                                Gestiona tu inventario, precios y disponibilidad.
                            </p>
                        </div>
                        <div className="p-4 border border-green-200 rounded-md bg-green-50">
                            <h4 className="font-medium text-green-900 mb-2">📋 Órdenes</h4>
                            <p className="text-sm text-green-800">
                                Revisa y actualiza el estado de las órdenes.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}; 