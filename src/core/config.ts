const baseUrl = import.meta.env.VITE_API_URL || '';

export const API_BASE_URL = baseUrl ? `${baseUrl}/api` : '/api';
export const STATIC_BASE_URL = baseUrl || '';
