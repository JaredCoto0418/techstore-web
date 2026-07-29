const NAME_ID_CLAIM = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier';

/**
 * Obtiene el ID del usuario (claim nameidentifier) desde el JWT.
 * Usa el token pasado por parámetro o, si no, el guardado en localStorage.
 */
export const getUserIdFromToken = (token?: string): string => {
    const jwt = token ?? localStorage.getItem('token') ?? '';
    if (!jwt) return '';
    try {
        const payload = JSON.parse(atob(jwt.split('.')[1]));
        return payload[NAME_ID_CLAIM] || '';
    } catch {
        return '';
    }
};
