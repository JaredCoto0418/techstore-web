import { Link } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { Role } from '../../../infrastructure/enums/role.enum';

export const AdminDashboardPage = () => {
    const { authenticated, roles } = useAuthStore();

    const isAdmin = roles?.includes(Role.ADMINISTRADOR);

    if (!authenticated || !isAdmin) {
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
            title: 'Gestión de Productos',
            description: 'Administra el catálogo de productos',
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
            ),
            link: '/admin/products',
            color: 'bg-blue-500'
        },
        {
            title: 'Gestión de Órdenes',
            description: 'Revisa y gestiona todas las órdenes',
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
            ),
            link: '/admin/orders',
            color: 'bg-purple-500'
        },
        {
            title: 'Gestión de Usuarios',
            description: 'Administra usuarios y roles',
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
            ),
            link: '/admin/users',
            color: 'bg-orange-500'
        },
        {
            title: 'Gestión de Categorías',
            description: 'Organiza las categorías de productos',
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
            ),
            link: '/admin/categories',
            color: 'bg-indigo-500'
        }
    ];

    return (
        <div className="bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Panel de Administración</h1>
                            <p className="mt-1 text-sm text-gray-600">
                                Bienvenido al centro de control de TechStore
                            </p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                Sistema Activo
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* Módulos principales */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Módulos de Gestión</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {dashboardCards.map((card, index) => (
                            <Link
                                key={index}
                                to={card.link}
                                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200 group"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`w-12 h-12 ${card.color} rounded-lg flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-200`}>
                                        {card.icon}
                                    </div>
                                    <div className="text-right">
                                        <span className="text-xl font-bold text-indigo-600">Gestionar</span>
                                    </div>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors duration-200">
                                    {card.title}
                                </h3>
                                <p className="text-gray-600 text-sm">
                                    {card.description}
                                </p>
                                <div className="mt-4 flex items-center text-indigo-600 text-sm font-medium group-hover:text-indigo-700">
                                    Acceder
                                    <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>


            </div>
        </div>
    );
}; 