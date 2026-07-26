
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore.ts';
import { Role } from '../../../infrastructure/enums/role.enum.ts';

export const Navbar = () => {
    const { authenticated, roles, logout } = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isAdmin = roles?.includes(Role.ADMINISTRADOR);
    const isVendor = roles?.includes(Role.VENDEDOR);
    const isClient = roles?.includes(Role.CLIENTE);

    return (
        <nav className="bg-indigo-600 text-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center">
                        <Link to="/" className="text-xl font-bold">
                            TechStore
                        </Link>
                    </div>

                    <div className="flex items-center space-x-4">
                        {authenticated ? (
                            <>
                                <Link to="/" className="hover:text-indigo-200 transition-colors">
                                    Inicio
                                </Link>

                                {/* Enlaces para Administrador */}
                                {isAdmin && (
                                    <>
                                        <Link to="/admin/users" className="hover:text-indigo-200 transition-colors">
                                            Usuarios
                                        </Link>
                                        <Link to="/admin/products" className="hover:text-indigo-200 transition-colors">
                                            Productos
                                        </Link>
                                        <Link to="/admin/categories" className="hover:text-indigo-200 transition-colors">
                                            Categorías
                                        </Link>
                                        <Link to="/admin/orders" className="hover:text-indigo-200 transition-colors">
                                            Órdenes
                                        </Link>
                                    </>
                                )}

                                {/* Enlaces para Vendedor */}
                                {isVendor && (
                                    <>
                                        <Link to="/vendor/products" className="hover:text-indigo-200 transition-colors">
                                            Mis Productos
                                        </Link>
                                        <Link to="/vendor/orders" className="hover:text-indigo-200 transition-colors">
                                            Mis Órdenes
                                        </Link>
                                    </>
                                )}

                                {/* Enlaces para Cliente */}
                                {isClient && (
                                    <>
                                        <Link to="/client/orders" className="hover:text-indigo-200 transition-colors">
                                            Mis Órdenes
                                        </Link>
                                        <Link to="/client/transactions" className="hover:text-indigo-200 transition-colors">
                                            Historial de Pagos
                                        </Link>
                                        <Link to="/catalog" className="hover:text-indigo-200 transition-colors">
                                            Catálogo
                                        </Link>
                                    </>
                                )}

                                <button
                                    onClick={handleLogout}
                                    className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md transition-colors"
                                >
                                    Cerrar Sesión
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/catalog" className="hover:text-indigo-200 transition-colors">
                                    Catálogo
                                </Link>
                                <Link to="/login" className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-md transition-colors">
                                    Iniciar Sesión
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}; 