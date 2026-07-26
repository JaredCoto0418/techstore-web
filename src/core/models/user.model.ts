export interface UserCreateModel {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    roles: string[];
}

export interface UserEditModel {
    email: string;
    firstName: string;
    lastName: string;
    newPassword?: string;
    roles: string[];
} 