import { useState } from 'react';
import { getSellers } from '../../core/api/users.api';

export const useUsers = () => {
    const [sellers, setSellers] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchSellers = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await getSellers();
            if (response.status) {
                setSellers(response.data || []);
            } else {
                setError(response.message || 'Error al obtener vendedores');
            }
        } catch (err) {
            setError('Error al obtener vendedores');
            console.error('Error fetching sellers:', err);
        } finally {
            setLoading(false);
        }
    };

    return {
        sellers,
        loading,
        error,
        fetchSellers
    };
}; 