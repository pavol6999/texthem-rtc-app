export interface ApiToken {
    type: 'bearer';
    token: string;
    expires_at?: string;
    expires_in?: number;
}

export interface RegisterData {
    nickname: string;
    email: string;
    password: string;
    passwordConfirmation: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
    remember: boolean;
}

export interface User {
    id: number;
    email: string;
    nickname: string
    remember_me_token?: string
    created_at: string;
    updated_at: string;
    notifications?: boolean
}
