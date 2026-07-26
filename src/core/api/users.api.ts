import { http } from "./http";
import type { ApiResponse } from "../../infrastructure/interfaces/api.response";
import type { UserResponse } from "../../infrastructure/interfaces/user.response";
import type { UserCreateModel, UserEditModel } from "../models/user.model";

export const getUsers = async (searchTerm = "", page = 1, pageSize = 0): Promise<ApiResponse<UserResponse[]>> => {
    const { data } = await http.get<ApiResponse<UserResponse[]>>('/users', {
        params: { searchTerm, page, pageSize }
    });
    return data;
};

export const getUserById = async (id: string): Promise<ApiResponse<UserResponse>> => {
    const { data } = await http.get<ApiResponse<UserResponse>>(`/users/${id}`);
    return data;
};

export const createUser = async (user: UserCreateModel): Promise<ApiResponse<object>> => {
    const { data } = await http.post<ApiResponse<object>>('/users', user);
    return data;
};

export const updateUser = async (id: string, user: UserEditModel): Promise<ApiResponse<object>> => {
    const { data } = await http.put<ApiResponse<object>>(`/users/${id}`, user);
    return data;
};

export const deleteUser = async (id: string): Promise<ApiResponse<object>> => {
    const response = await http.delete(`/users/${id}`);
    
    // Si el status code es 204 (No Content), no hay data en la respuesta
    if (response.status === 204) {
        return {
            status: true,
            statusCode: 204,
            message: "Usuario eliminado exitosamente"
        };
    }
    
    return response.data;
};

export const getSellers = async (): Promise<ApiResponse<UserResponse[]>> => {
    const token = localStorage.getItem('token');
    const { data } = await http.get<ApiResponse<UserResponse[]>>('/users/sellers', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return data;
};