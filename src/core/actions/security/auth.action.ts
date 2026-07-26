import { AxiosError } from "axios";
import type { ApiResponse } from "../../../infrastructure/interfaces/api.response";
import type { LoginModel } from "../../models/login.model";
import type { UserCreateModel } from "../../models/user.model";
import type { ApiErrorResponse } from "../../../infrastructure/interfaces/api-error.response";
import { loginApi, registerApi } from "../../api/auth.tienda.api";

export const loginAction = async (credentials: LoginModel): Promise<ApiResponse<any>> => {
    try {
        return await loginApi(credentials);
    } catch (error) {
        const apiError = error as AxiosError<ApiErrorResponse>;
        return {
            status: false,
            message: apiError.response?.data?.message || "Error al iniciar sesión",
        };
    }
};

export const registerAction = async (user: UserCreateModel): Promise<ApiResponse<object>> => {
    try {
        return await registerApi(user);
    } catch (error) {
        const apiError = error as AxiosError<ApiErrorResponse>;
        
        if (apiError.response) {
            const statusCode = apiError.response.status;
            let message = apiError.response.data.message || "Error al registrar usuario";
            
            // Mensajes más específicos según el código de estado
            if (statusCode === 400) {
                if (message.toLowerCase().includes('email') || message.toLowerCase().includes('correo')) {
                    message = "El correo electrónico ya está registrado o es inválido";
                } else if (message.toLowerCase().includes('password') || message.toLowerCase().includes('contraseña')) {
                    message = "La contraseña debe tener al menos 6 caracteres";
                } else {
                    message = "Datos de entrada inválidos. Verifica todos los campos";
                }
            } else if (statusCode === 409) {
                message = "El correo electrónico ya está registrado";
            } else if (statusCode === 500) {
                message = "Error del servidor. Inténtalo de nuevo más tarde";
            }
            
            return {
                status: false,
                message: message,
            };
        } else if (apiError.request) {
            return {
                status: false,
                message: "Error de conexión. Verifica tu conexión a internet"
            };
        } else {
            return {
                status: false,
                message: "Error desconocido. Inténtalo de nuevo"
            };
        }
    }
}; 