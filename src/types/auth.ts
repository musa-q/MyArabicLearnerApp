export interface User {
    email: string;
}

export interface AuthContextType {
    user: User | null;
    login: (token: string, refreshToken: string, email: string) => Promise<void>;
    logout: () => Promise<void>;
}
