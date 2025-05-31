export interface AuthRequest {
    email: string;
    password: string;
    unit: string;
    role: string;
}

export interface AuthResponse {
    token: string;
    user: {
        email: string;
        unit: string;
        role: string;
    };
}