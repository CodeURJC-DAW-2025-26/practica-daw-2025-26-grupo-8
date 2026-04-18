export interface UserDTO {
    id: number;
    email: string;
    name: string;
    roles: string[];
}

export interface UserRegisterDTO {
    name: string;
    email: string;
    password?: string;
    confirmPassword?: string;
}

export interface UserUpdateDTO {
    name?: string;
    email?: string;
    oldPassword?: string;
    newPassword?: string;
}