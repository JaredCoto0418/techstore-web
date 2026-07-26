import { AxiosError } from "axios";
import type { ApiResponse } from "../../../../infrastructure/interfaces/api.response";
import type { LoginResponse } from "../../../../infrastructure/interfaces/login.response";
import type { LoginModel } from "../../../models/login.model";
import type { ApiErrorResponse } from "../../../../infrastructure/interfaces/api-error.response";
import { authTiendaApi } from "../../../api/auth.tienda.api";

export const loginAction = async (login: LoginModel): Promise<ApiResponse<LoginResponse>> => {
    try {
        const { data } = await authTiendaApi.post<ApiResponse<LoginResponse>>(
            '/auth/login',
            login
        );

        return data;
        
    } catch (error) {
        const apiError = error as AxiosError<ApiErrorResponse>;

        console.error(apiError);

        if(apiError.response) {
            const statusCode = apiError.response.status;
            let message = apiError.response.data.message || "Error al iniciar sesión";
            
            // Mensajes más específicos según el código de estado
            if (statusCode === 401) {
                message = "Correo electrónico o contraseña incorrectos";
            } else if (statusCode === 400) {
                message = "Datos de entrada inválidos";
            } else if (statusCode === 404) {
                message = "Usuario no encontrado";
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
            }
        } else {
            return {
                status: false,
                message: "Error desconocido. Inténtalo de nuevo"
            }
        }
        
    }
} 