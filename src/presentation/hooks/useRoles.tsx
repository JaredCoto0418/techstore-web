import { useState, useEffect } from 'react';
import { fetchRoles } from '../../core/actions/security/roles.actions';
import type { RoleResponse } from '../../infrastructure/interfaces/role.response';

export const useRoles = () => {
    const [roles, setRoles] = useState<RoleResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadRoles = async () => {
        try {
            setLoading(true);
            setError(null);
            const rolesData = await fetchRoles();
            setRoles(rolesData);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al cargar roles');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadRoles();
    }, []);

    return {
        roles,
        loading,
        error,
        refetch: loadRoles
    };
}; 