import { publicHttp } from "./http";
import type { ApiResponse } from "../../infrastructure/interfaces/api.response";
import type { LoginModel } from "../models/login.model";
import type { UserCreateModel } from "../models/user.model";

export const loginApi = async (credentials: LoginModel): Promise<ApiResponse<any>> => {
    const { data } = await publicHttp.post<ApiResponse<any>>('/auth/login', credentials);
    return data;
};

export const registerApi = async (user: UserCreateModel): Promise<ApiResponse<object>> => {
    const { data } = await publicHttp.post<ApiResponse<object>>('/auth/register', user);
    return data;
}; 