export interface User {
    id: number;
    username: string;
}

export interface AuthResponse {
    id: number;
    username: string;
    token: string;
}

export interface LoginRequest {
    username: string;
    password: string;
}

export interface SignupRequest {
    username: string;
    password: string;
}