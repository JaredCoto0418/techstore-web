export interface ApiResponse<T = unknown> {
    statusCode?: number;
    status: boolean;
    message?: string | null;
    data?: T;
    errors?: string[] | null;
} 