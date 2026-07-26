import React, { useState, useEffect } from 'react';
import { useUsersManagement } from '../../hooks/useUsersManagement.tsx';
import { useRoles } from '../../hooks/useRoles.tsx';
import { useAuthStore } from '../../stores/authStore.ts';
import { Role } from '../../../infrastructure/enums/role.enum.ts';
import type { UserCreateModel, UserEditModel } from '../../../core/models/user.model.ts';

export const UsersManagementPage = () => {
    const { users, loading, error, fetchUsers, createUser, updateUser, deleteUser } = useUsersManagement();
    const { roles: availableRoles } = useRoles();
    const { roles: userRoles } = useAuthStore();
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const isAdmin = userRoles?.includes(Role.ADMINISTRADOR);

    useEffect(() => {
        if (isAdmin) {
            fetchUsers();
        }
    }, [isAdmin]);

    const handleCreateUser = async (userData: UserCreateModel) => {
        const success = await createUser(userData);
        if (success) {
            setShowCreateModal(false);
        }
    };

    const handleUpdateUser = async (id: string, userData: UserEditModel) => {
        const success = await updateUser(id, userData);
        if (success) {
            setShowEditModal(false);
            setSelectedUser(null);
        }
    };

    const handleDeleteUser = async (id: string) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
            await deleteUser(id);
        }
    };

    const handleEdit = (user: any) => {
        setSelectedUser(user);
        setShowEditModal(true);
    };

    if (!isAdmin) {
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
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">Gestión de Usuarios</h1>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md transition-colors"
                >
                    Crear Usuario
                </button>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            )}

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                    <input
                        type="text"
                        placeholder="Buscar usuarios..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Usuario
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Email
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Roles
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {users
                                                                .filter((user: any) =>
                                    user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                    user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                    user.email.toLowerCase().includes(searchTerm.toLowerCase())
                                )
                                .map((user: any) => (
                                <tr key={user.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10">
                                                <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                                    <span className="text-indigo-600 font-medium">
                                                        {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {user.firstName} {user.lastName}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {user.email}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex flex-wrap gap-1">
                                            {user.roles.map((role: any, index: number) => (
                                                <span
                                                    key={index}
                                                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                                                >
                                                    {role}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => handleEdit(user)}
                                                className="text-indigo-600 hover:text-indigo-900"
                                            >
                                                Editar
                                            </button>
                                            <button
                                                onClick={() => handleDeleteUser(user.id)}
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

            {/* Modal de Crear Usuario */}
            {showCreateModal && (
                <CreateUserModal
                    availableRoles={availableRoles}
                    onClose={() => setShowCreateModal(false)}
                    onSubmit={handleCreateUser}
                />
            )}

            {/* Modal de Editar Usuario */}
            {showEditModal && selectedUser && (
                <EditUserModal
                    user={selectedUser}
                    availableRoles={availableRoles}
                    onClose={() => {
                        setShowEditModal(false);
                        setSelectedUser(null);
                    }}
                    onSubmit={handleUpdateUser}
                />
            )}
        </div>
    );
};

// Componente Modal para Crear Usuario
const CreateUserModal = ({ availableRoles, onClose, onSubmit }: { 
    availableRoles: any[]; 
    onClose: () => void; 
    onSubmit: (user: UserCreateModel) => void 
}) => {
    const [formData, setFormData] = useState({
        email: '',
        firstName: '',
        lastName: '',
        password: '',
        roles: [] as string[]
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                <div className="mt-3">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Crear Usuario</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Nombre</label>
                            <input
                                type="text"
                                required
                                value={formData.firstName}
                                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Apellido</label>
                            <input
                                type="text"
                                required
                                value={formData.lastName}
                                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Contraseña</label>
                            <input
                                type="password"
                                required
                                value={formData.password}
                                onChange={(e) => setFormData({...formData, password: e.target.value})}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Roles</label>
                            <div className="mt-2 space-y-2">
                                {availableRoles.map((role) => (
                                    <label key={role.id} className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={formData.roles.includes(role.name)}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setFormData({...formData, roles: [...formData.roles, role.name]});
                                                } else {
                                                    setFormData({...formData, roles: formData.roles.filter(r => r !== role.name)});
                                                }
                                            }}
                                            className="mr-2"
                                        />
                                        {role.name}
                                    </label>
                                ))}
                            </div>
                        </div>
                        <div className="flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700"
                            >
                                Crear
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

// Componente Modal para Editar Usuario
const EditUserModal = ({ user, availableRoles, onClose, onSubmit }: { 
    user: any; 
    availableRoles: any[];
    onClose: () => void; 
    onSubmit: (id: string, user: UserEditModel) => void 
}) => {
    const [formData, setFormData] = useState({
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        newPassword: '',
        roles: user.roles
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const submitData = {
            ...formData,
            newPassword: formData.newPassword || undefined
        };
        onSubmit(user.id, submitData);
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                <div className="mt-3">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Editar Usuario</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Nombre</label>
                            <input
                                type="text"
                                required
                                value={formData.firstName}
                                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Apellido</label>
                            <input
                                type="text"
                                required
                                value={formData.lastName}
                                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Nueva Contraseña (opcional)</label>
                            <input
                                type="password"
                                value={formData.newPassword}
                                onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Roles</label>
                            <div className="mt-2 space-y-2">
                                {availableRoles.map((role) => (
                                    <label key={role.id} className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={formData.roles.includes(role.name)}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setFormData({...formData, roles: [...formData.roles, role.name]});
                                                } else {
                                                    setFormData({...formData, roles: formData.roles.filter((r: any) => r !== role.name)});
                                                }
                                            }}
                                            className="mr-2"
                                        />
                                        {role.name}
                                    </label>
                                ))}
                            </div>
                        </div>
                        <div className="flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700"
                            >
                                Guardar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}; 