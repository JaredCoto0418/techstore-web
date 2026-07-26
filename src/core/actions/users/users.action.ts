import { AxiosError } from "axios";
import type { ApiResponse } from "../../../infrastructure/interfaces/api.response";
import type { UserResponse } from "../../../infrastructure/interfaces/user.response";
import type { UserCreateModel, UserEditModel } from "../../models/user.model";
import type { ApiErrorResponse } from "../../../infrastructure/interfaces/api-error.response";
import { getUsers, getUserById, createUser, updateUser, deleteUser } from "../../api/users.api";

export const getUsersAction = async (searchTerm = "", page = 1, pageSize = 0): Promise<ApiResponse<UserResponse[]>> => {
    try {
        return await getUsers(searchTerm, page, pageSize);
    } catch (error) {
        const apiError = error as AxiosError<ApiErrorResponse>;
        return {
            status: false,
            message: apiError.response?.data?.message || "Error al obtener usuarios",
        };
    }
};

export const getUserByIdAction = async (id: string): Promise<ApiResponse<UserResponse>> => {
    try {
        return await getUserById(id);
    } catch (error) {
        const apiError = error as AxiosError<ApiErrorResponse>;
        return {
            status: false,
            message: apiError.response?.data?.message || "Error al obtener usuario",
        };
    }
};

export const createUserAction = async (user: UserCreateModel): Promise<ApiResponse<object>> => {
    try {
        return await createUser(user);
    } catch (error) {
        const apiError = error as AxiosError<ApiErrorResponse>;
        return {
            status: false,
            message: apiError.response?.data?.message || "Error al crear usuario",
        };
    }
};

export const updateUserAction = async (id: string, user: UserEditModel): Promise<ApiResponse<object>> => {
    try {
        return await updateUser(id, user);
    } catch (error) {
        const apiError = error as AxiosError<ApiErrorResponse>;
        return {
            status: false,
            message: apiError.response?.data?.message || "Error al actualizar usuario",
        };
    }
};

export const deleteUserAction = async (id: string): Promise<ApiResponse<object>> => {
    try {
        const response = await deleteUser(id);
        // Si la respuesta es 204 (No Content), consideramos que fue exitosa
        if (response.statusCode === 204) {
            return {
                status: true,
                statusCode: 204,
                message: "Usuario eliminado exitosamente"
            };
        }
        return response;
    } catch (error) {
        const apiError = error as AxiosError<ApiErrorResponse>;
        return {
            status: false,
            message: apiError.response?.data?.message || "Error al eliminar usuario",
        };
    }
}; 