import axios from "axios";
import type { ApiResponse } from "../../infrastructure/interfaces/api.response";
import type { LoginModel } from "../models/login.model";
import type { UserCreateModel } from "../models/user.model";

export const authTiendaApi = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "https://localhost:7066/api",
});

export const loginApi = async (credentials: LoginModel): Promise<ApiResponse<any>> => {
    const { data } = await authTiendaApi.post<ApiResponse<any>>('/auth/login', credentials);
    return data;
};

export const registerApi = async (user: UserCreateModel): Promise<ApiResponse<object>> => {
    const { data } = await authTiendaApi.post<ApiResponse<object>>('/auth/register', user);
    return data;
}; 