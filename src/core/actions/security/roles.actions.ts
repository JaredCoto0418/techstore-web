import { getRoles } from "../../api/roles.api";
import type { RoleResponse } from "../../../infrastructure/interfaces/role.response";

export const fetchRoles = async (searchTerm = "", page = 1, pageSize = 0): Promise<RoleResponse[]> => {
    try {
        const response = await getRoles(searchTerm, page, pageSize);
        if (response.status && response.data) {
            return response.data;
        }
        throw new Error(response.message || 'Error al obtener roles');
    } catch (error) {
        console.error('Error fetching roles:', error);
        throw error;
    }
}; 