import { http } from "./http";
import type { ApiResponse } from "../../infrastructure/interfaces/api.response";
import type { RoleResponse } from "../../infrastructure/interfaces/role.response";

export const getRoles = async (searchTerm = "", page = 1, pageSize = 0): Promise<ApiResponse<RoleResponse[]>> => {
    const { data } = await http.get<ApiResponse<RoleResponse[]>>('/roles', {
        params: { searchTerm, page, pageSize }
    });
    return data;
};

export const getRoleById = async (id: string): Promise<ApiResponse<RoleResponse>> => {
    const { data } = await http.get<ApiResponse<RoleResponse>>(`/roles/${id}`);
    return data;
}; 