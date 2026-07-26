import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '../presentation/stores/authStore.ts';
import { Layout } from '../presentation/components/layout/Layout.tsx';
import { LoginPage } from '../presentation/pages/security/auth/LoginPage.tsx';
import { HomePage } from '../presentation/pages/home/HomePage.tsx';
import { UsersManagementPage } from '../presentation/pages/admin/UsersManagementPage.tsx';
import { ProductsManagementPage } from '../presentation/pages/admin/ProductsManagementPage.tsx';
import { CategoriesManagementPage } from '../presentation/pages/admin/CategoriesManagementPage.tsx';
import { ClientCatalogPage } from '../presentation/pages/client/ClientCatalogPage.tsx';
import { PublicCatalogPage } from '../presentation/pages/client/PublicCatalogPage.tsx';
import { VendorProductsPage } from '../presentation/pages/vendor/VendorProductsPage.tsx';
import { VendorOrdersPage } from '../presentation/pages/vendor/VendorOrdersPage.tsx';
import { AdminDashboardPage } from '../presentation/pages/admin/AdminDashboardPage.tsx';
import { AdminOrdersPage } from '../presentation/pages/admin/AdminOrdersPage.tsx';
import { ClientDashboardPage } from '../presentation/pages/client/ClientDashboardPage.tsx';
import { VendorDashboardPage } from '../presentation/pages/vendor/VendorDashboardPage.tsx';
import { Role } from '../infrastructure/enums/role.enum.ts';
import { ClientOrdersPage } from '../presentation/pages/client/ClientOrdersPage.tsx';

// Componente para rutas protegidas
const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode; allowedRoles?: Role[] }) => {
    const { authenticated, roles } = useAuthStore();

    if (!authenticated) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && roles) {
        const hasRequiredRole = allowedRoles.some(role => roles.includes(role));
        if (!hasRequiredRole) {
            return <Navigate to="/" replace />;
        }
    }

    return <>{children}</>;
};

// Componente para redirigir según el rol
const RoleDashboard = () => {
    const { roles } = useAuthStore();

    if (roles?.includes(Role.ADMINISTRADOR)) {
        return <AdminDashboardPage />;
    } else if (roles?.includes(Role.VENDEDOR)) {
        return <VendorDashboardPage />;
    } else if (roles?.includes(Role.CLIENTE)) {
        return <ClientDashboardPage />;
    } else {
        return <Navigate to="/login" replace />;
    }
};

export const AppRouter = () => {
    const { authenticated, roles } = useAuthStore();

    return (
        <BrowserRouter>
            <Routes>
                {/* Ruta pública */}
                <Route path="/login" element={
                    authenticated ? <Navigate to="/" replace /> : <LoginPage />
                } />

                {/* Ruta de registro público */}
                <Route path="/register" element={
                    authenticated ? <Navigate to="/" replace /> : <HomePage />
                } />

                {/* Ruta del catálogo - solo para clientes o público */}
                <Route path="/catalog" element={
                    !authenticated ? (
                        <PublicCatalogPage />
                    ) : roles?.includes(Role.CLIENTE) ? (
                        <Layout>
                            <ClientCatalogPage />
                        </Layout>
                    ) : (
                        <Navigate to="/" replace />
                    )
                } />

                {/* Ruta principal - redirección automática por rol */}
                <Route path="/" element={
                    <ProtectedRoute>
                        <Layout>
                            <RoleDashboard />
                        </Layout>
                    </ProtectedRoute>
                } />

                {/* Rutas de Administrador */}
                <Route path="/admin" element={
                    <ProtectedRoute allowedRoles={[Role.ADMINISTRADOR]}>
                        <Layout>
                            <AdminDashboardPage />
                        </Layout>
                    </ProtectedRoute>
                } />

                <Route path="/admin/users" element={
                    <ProtectedRoute allowedRoles={[Role.ADMINISTRADOR]}>
                        <Layout>
                            <UsersManagementPage />
                        </Layout>
                    </ProtectedRoute>
                } />

                <Route path="/admin/products" element={
                    <ProtectedRoute allowedRoles={[Role.ADMINISTRADOR, Role.VENDEDOR]}>
                        <Layout>
                            <ProductsManagementPage />
                        </Layout>
                    </ProtectedRoute>
                } />

                <Route path="/admin/categories" element={
                    <ProtectedRoute allowedRoles={[Role.ADMINISTRADOR]}>
                        <Layout>
                            <CategoriesManagementPage />
                        </Layout>
                    </ProtectedRoute>
                } />

                <Route path="/admin/orders" element={
                    <ProtectedRoute allowedRoles={[Role.ADMINISTRADOR]}>
                        <Layout>
                            <AdminOrdersPage />
                        </Layout>
                    </ProtectedRoute>
                } />

                {/* Rutas para Cliente */}
                <Route path="/client/orders" element={
                    <ProtectedRoute allowedRoles={[Role.CLIENTE]}>
                        <Layout>
                            <ClientOrdersPage />
                        </Layout>
                    </ProtectedRoute>
                } />

                {/* Rutas de Vendedor */}
                <Route path="/vendor/products" element={
                    <ProtectedRoute allowedRoles={[Role.VENDEDOR]}>
                        <Layout>
                            <VendorProductsPage />
                        </Layout>
                    </ProtectedRoute>
                } />

                <Route path="/vendor/orders" element={
                    <ProtectedRoute allowedRoles={[Role.VENDEDOR]}>
                        <Layout>
                            <VendorOrdersPage />
                        </Layout>
                    </ProtectedRoute>
                } />

                {/* Ruta por defecto */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}; 