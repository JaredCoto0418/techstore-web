
import { useState, useEffect } from 'react';
import { useAuthStore } from '../../stores/authStore.ts';
import { Role } from '../../../infrastructure/enums/role.enum.ts';
import { registerAction } from '../../../core/actions/security/auth.action.ts';
import type { UserCreateModel } from '../../../core/models/user.model.ts';
import { useLocation } from 'react-router-dom';

export const HomePage = () => {
    const { authenticated, roles, email, logout, login } = useAuthStore();
    const location = useLocation();

    // Función para obtener el nombre completo del usuario desde el token
    const getUserFullName = () => {
        const token = localStorage.getItem('token');
        if (!token) return email || 'Usuario';
        
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const firstName = payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname'] || '';
            const lastName = payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname'] || '';
            
            if (firstName && lastName) {
                return `${firstName} ${lastName}`;
            } else if (firstName) {
                return firstName;
            } else if (lastName) {
                return lastName;
            }
            
            return email || 'Usuario';
        } catch (error) {
            return email || 'Usuario';
        }
    };
    const [, setShowRegister] = useState(location.pathname === '/register');
    const [registerData, setRegisterData] = useState<UserCreateModel>({
        email: '',
        firstName: '',
        lastName: '',
        password: '',
        roles: []
    });
    const [registerLoading, setRegisterLoading] = useState(false);
    const [registerError, setRegisterError] = useState<string | null>(null);
    const [registerSuccess, setRegisterSuccess] = useState(false);

    const isAdmin = roles?.includes(Role.ADMINISTRADOR);
    const isVendor = roles?.includes(Role.VENDEDOR);
    const isClient = roles?.includes(Role.CLIENTE);

    // Actualizar showRegister cuando cambie la ruta
    useEffect(() => {
        setShowRegister(location.pathname === '/register');
    }, [location.pathname]);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setRegisterLoading(true);
        setRegisterError(null);

        try {
            const response = await registerAction(registerData);
            if (response.status) {
                setRegisterSuccess(true);
                
                // Login automático después del registro exitoso
                try {
                    await login({
                        email: registerData.email,
                        password: registerData.password
                    });
                    
                    // Limpiar formulario
                    setRegisterData({
                        email: '',
                        firstName: '',
                        lastName: '',
                        password: '',
                        roles: []
                    });
                    
                    // Ocultar formulario de registro después de un breve delay
                    setTimeout(() => {
                        setShowRegister(false);
                        setRegisterSuccess(false);
                    }, 2000);
                    
                } catch (loginError) {
                    console.error('Error en login automático:', loginError);
                    // Si falla el login automático, mostrar mensaje de éxito pero no hacer login
                }
            } else {
                setRegisterError(response.message || 'Error al registrar usuario');
            }
        } catch (error) {
            setRegisterError('Error al registrar usuario');
        } finally {
            setRegisterLoading(false);
        }
    };

    if (!authenticated) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                    Bienvenido a TechStore
                </h1>
                <p className="text-xl text-gray-600 mb-8">
                    Tu tienda de productos tecnológicos
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a
                        href="/catalog"
                        className="inline-flex items-center justify-center bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                        Ver Catálogo
                    </a>
                    <a
                        href="/login"
                        className="inline-flex items-center justify-center bg-white text-indigo-600 border border-indigo-600 px-6 py-3 rounded-lg hover:bg-indigo-50 transition-colors font-medium"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                        </svg>
                        Iniciar Sesión
                    </a>
                </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Información de la tienda */}
                    <div className="bg-white p-8 rounded-lg shadow-lg">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">¿Qué ofrecemos?</h2>
                <div className="space-y-4">
                            <div className="flex items-start space-x-3">
                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <span className="text-blue-600 font-bold">✓</span>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">Productos Tecnológicos</h3>
                                    <p className="text-gray-600">Amplia gama de productos tecnológicos de alta calidad</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-3">
                                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <span className="text-purple-600 font-bold">✓</span>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">Atención Personalizada</h3>
                                    <p className="text-gray-600">Servicio al cliente de primera calidad</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Formulario de registro o login */}
                    <div className="bg-white p-8 rounded-lg shadow-lg">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Crear Cuenta de Cliente</h2>
                        
                        {registerSuccess && (
                            <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
                                <div className="flex items-center">
                                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    ¡Cuenta creada exitosamente! Ya puedes iniciar sesión.
                                </div>
                            </div>
                        )}

                        {registerError && (
                            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                                <div className="flex items-center">
                                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    {registerError}
                                </div>
                            </div>
                        )}

                        <form onSubmit={handleRegister} className="space-y-4" autoComplete="on" method="post">
                            <div>
                                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                                    Nombre
                                </label>
                                <input
                                    type="text"
                                    id="firstName"
                                    name="firstName"
                                    autoComplete="given-name"
                                    value={registerData.firstName}
                                    onChange={(e) => {
                                        setRegisterData({...registerData, firstName: e.target.value});
                                        if (registerError) setRegisterError(null);
                                    }}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                                    Apellido
                                </label>
                                <input
                                    type="text"
                                    id="lastName"
                                    name="lastName"
                                    autoComplete="family-name"
                                    value={registerData.lastName}
                                    onChange={(e) => {
                                        setRegisterData({...registerData, lastName: e.target.value});
                                        if (registerError) setRegisterError(null);
                                    }}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                    Correo Electrónico
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    autoComplete="email"
                                    value={registerData.email}
                                    onChange={(e) => {
                                        setRegisterData({...registerData, email: e.target.value});
                                        if (registerError) setRegisterError(null);
                                    }}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                    Contraseña
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    autoComplete="new-password"
                                    value={registerData.password}
                                    onChange={(e) => {
                                        setRegisterData({...registerData, password: e.target.value});
                                        if (registerError) setRegisterError(null);
                                    }}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    required
                                    minLength={6}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={registerLoading}
                                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {registerLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
                            </button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-gray-600">
                                ¿Ya tienes una cuenta?{' '}
                                <button
                                    onClick={() => setShowRegister(false)}
                                    className="text-indigo-600 hover:text-indigo-500 font-medium"
                                >
                                    Inicia sesión
                                </button>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Enlace al login */}
                <div className="text-center mt-8">
                    <p className="text-gray-600">
                        ¿Ya tienes una cuenta?{' '}
                        <a
                            href="/login"
                            className="text-indigo-600 hover:text-indigo-500 font-medium"
                        >
                            Inicia sesión
                        </a>
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="text-center bg-white p-8 rounded-lg shadow-lg">
                <div className="flex justify-between items-start mb-4">
                    <div></div>
                    <button
                        onClick={logout}
                        className="inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 transition-colors"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Cerrar Sesión
                    </button>
                </div>
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                    Bienvenido a TechStore
                </h1>
                <p className="text-xl text-gray-600">
                    Hola, {getUserFullName()}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Panel de Administrador */}
                {isAdmin && (
                    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                            <svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                            Panel de Administración
                        </h3>
                        <div className="space-y-3">
                            <a href="/admin" className="block">
                                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors cursor-pointer">
                                    <span className="text-blue-700">Dashboard Principal</span>
                                    <span className="text-blue-500">→</span>
                                </div>
                            </a>
                            <a href="/admin/users" className="block">
                                <div className="flex items-center justify-between p-3 bg-green-50 rounded-md hover:bg-green-100 transition-colors cursor-pointer">
                                    <span className="text-green-700">Gestión de Usuarios</span>
                                    <span className="text-green-500">→</span>
                                </div>
                            </a>
                            <a href="/admin/products" className="block">
                                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-md hover:bg-purple-100 transition-colors cursor-pointer">
                                    <span className="text-purple-700">Gestión de Productos</span>
                                    <span className="text-purple-500">→</span>
                                </div>
                            </a>
                            <a href="/admin/orders" className="block">
                                <div className="flex items-center justify-between p-3 bg-red-50 rounded-md hover:bg-red-100 transition-colors cursor-pointer">
                                    <span className="text-red-700">Gestión de Órdenes</span>
                                    <span className="text-red-500">→</span>
                                </div>
                            </a>
                        </div>
                    </div>
                )}

                {/* Panel de Vendedor */}
                {isVendor && (
                    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                            <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            Panel de Vendedor
                        </h3>
                        <div className="space-y-3">
                            <a href="/vendor/products" className="block">
                                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors cursor-pointer">
                                    <span className="text-blue-700">Gestionar Productos</span>
                                    <span className="text-blue-500">→</span>
                                </div>
                            </a>
                            <a href="/vendor/orders" className="block">
                                <div className="flex items-center justify-between p-3 bg-green-50 rounded-md hover:bg-green-100 transition-colors cursor-pointer">
                                    <span className="text-green-700">Ver Mis Órdenes</span>
                                    <span className="text-green-500">→</span>
                                </div>
                            </a>
                            <a href="/vendor/catalog" className="block">
                                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-md hover:bg-purple-100 transition-colors cursor-pointer">
                                    <span className="text-purple-700">Ver Catálogo</span>
                                    <span className="text-purple-500">→</span>
                                </div>
                            </a>
                        </div>
                    </div>
                )}

                {/* Panel de Cliente */}
                {isClient && (
                    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                            <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            Panel de Cliente
                        </h3>
                        <div className="space-y-3">
                            <a href="/catalog" className="block">
                                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors cursor-pointer">
                                    <span className="text-blue-700">Ver Catálogo</span>
                                    <span className="text-blue-500">→</span>
                                </div>
                            </a>
                            <a href="/client/orders" className="block">
                                <div className="flex items-center justify-between p-3 bg-green-50 rounded-md hover:bg-green-100 transition-colors cursor-pointer">
                                    <span className="text-green-700">Mis Órdenes</span>
                                    <span className="text-green-500">→</span>
                                </div>
                            </a>
                        </div>
                    </div>
                )}

            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Funcionalidades Disponibles
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border border-gray-200 rounded-md hover:shadow-md transition-shadow">
                        <h4 className="font-medium text-gray-900 mb-2">Gestión de Productos</h4>
                        <p className="text-sm text-gray-600">
                            Administra el catálogo de productos tecnológicos disponibles en la tienda.
                        </p>
                    </div>
                    <div className="p-4 border border-gray-200 rounded-md hover:shadow-md transition-shadow">
                        <h4 className="font-medium text-gray-900 mb-2">Sistema de Órdenes</h4>
                        <p className="text-sm text-gray-600">
                            Controla las órdenes de compra y venta.
                        </p>
                    </div>
                    <div className="p-4 border border-gray-200 rounded-md hover:shadow-md transition-shadow">
                        <h4 className="font-medium text-gray-900 mb-2">Gestión de Usuarios</h4>
                        <p className="text-sm text-gray-600">
                            Administra usuarios con diferentes roles y permisos.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}; 