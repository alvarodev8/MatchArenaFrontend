export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
    role: string;
    remember_token?: string;
    created_at?: string;
    updated_at?: string;
    deleted_at?: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    role: string;
}