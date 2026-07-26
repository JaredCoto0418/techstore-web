import axios from "axios";
import type { ApiResponse } from "../../infrastructure/interfaces/api.response";
import type { RoleResponse } from "../../infrastructure/interfaces/role.response";

export const rolesApi = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "https://localhost:7066/api",
});

// Configurar interceptor para agregar token
rolesApi.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const getRoles = async (searchTerm = "", page = 1, pageSize = 0): Promise<ApiResponse<RoleResponse[]>> => {
    const { data } = await rolesApi.get<ApiResponse<RoleResponse[]>>('/roles', {
        params: { searchTerm, page, pageSize }
    });
    return data;
};

export const getRoleById = async (id: string): Promise<ApiResponse<RoleResponse>> => {
    const { data } = await rolesApi.get<ApiResponse<RoleResponse>>(`/roles/${id}`);
    return data;
}; 