import { useState } from 'react';
import type { TransactionResponse } from '../../infrastructure/interfaces/transaction.response';
import { getMyTransactionsAction, getAllTransactionsAction } from '../../core/actions/transactions/transactions.actions';

export const useTransactions = () => {
    const [transactions, setTransactions] = useState<TransactionResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchMyTransactions = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getMyTransactionsAction();
            if (response.status && response.data) {
                setTransactions(response.data);
            } else {
                setError(response.message || 'Error desconocido');
            }
        } catch (err) {
            setError('Error al cargar mis transacciones');
        } finally {
            setLoading(false);
        }
    };

    const fetchAllTransactions = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getAllTransactionsAction();
            if (response.status && response.data) {
                setTransactions(response.data);
            } else {
                setError(response.message || 'Error desconocido');
            }
        } catch (err) {
            setError('Error al cargar transacciones');
        } finally {
            setLoading(false);
        }
    };

    return {
        transactions,
        loading,
        error,
        fetchMyTransactions,
        fetchAllTransactions
    };
};
