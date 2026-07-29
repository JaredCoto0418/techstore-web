/**
 * Formatea un monto como moneda. Ej: formatCurrency(1250) -> "$1250.00"
 * formatCurrency(1250, "USD") -> "$1250.00 USD"
 */
export const formatCurrency = (amount?: number | null, currency?: string): string => {
    const value = (amount ?? 0).toFixed(2);
    return currency ? `$${value} ${currency}` : `$${value}`;
};
