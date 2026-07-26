import { useState } from 'react';
import type { UserResponse } from '../../infrastructure/interfaces/user.response';
import type { UserCreateModel, UserEditModel } from '../../core/models/user.model';
import { getUsersAction, getUserByIdAction, createUserAction, updateUserAction, deleteUserAction } from '../../core/actions/users/users.action';

export const useUsersManagement = () => {
    const [users, setUsers] = useState<UserResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchUsers = async (searchTerm = "", page = 1, pageSize = 0) => {
        setLoading(true);
        setError(null);
        try {
            const response = await getUsersAction(searchTerm, page, pageSize);
            if (response.status && response.data) {
                setUsers(response.data);
            } else {
                setError(response.message || 'Error desconocido');
            }
        } catch (err) {
            setError('Error al cargar usuarios');
        } finally {
            setLoading(false);
        }
    };

    const fetchUserById = async (id: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await getUserByIdAction(id);
            if (response.status && response.data) {
                return response.data;
            } else {
                setError(response.message || 'Error desconocido');
                return null;
            }
        } catch (err) {
            setError('Error al cargar usuario');
            return null;
        } finally {
            setLoading(false);
        }
    };

    const createUser = async (user: UserCreateModel) => {
        setLoading(true);
        setError(null);
        try {
            const response = await createUserAction(user);
            if (response.status) {
                await fetchUsers(); // Recargar lista
                return true;
            } else {
                setError(response.message || 'Error desconocido');
                return false;
            }
        } catch (err) {
            setError('Error al crear usuario');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const updateUser = async (id: string, user: UserEditModel) => {
        setLoading(true);
        setError(null);
        try {
            const response = await updateUserAction(id, user);
            if (response.status) {
                await fetchUsers(); // Recargar lista
                return true;
            } else {
                setError(response.message || 'Error desconocido');
                return false;
            }
        } catch (err) {
            setError('Error al actualizar usuario');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const deleteUser = async (id: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await deleteUserAction(id);
            // Para eliminación, consideramos éxito si no hay error específico
            // ya que algunos endpoints pueden devolver status false pero eliminar correctamente
            if (response.status || response.statusCode === 200 || response.statusCode === 204) {
                // Actualizar la lista localmente sin hacer otra llamada
                setUsers(prevUsers => prevUsers.filter(user => user.id !== id));
                return true;
            } else {
                setError(response.message || 'Error al eliminar usuario');
                return false;
            }
        } catch (err) {
            setError('Error al eliminar usuario');
            return false;
        } finally {
            setLoading(false);
        }
    };

    return {
        users,
        loading,
        error,
        fetchUsers,
        fetchUserById,
        createUser,
        updateUser,
        deleteUser
    };
}; 