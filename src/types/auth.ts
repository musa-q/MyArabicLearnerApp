export interface User {
    email: string;
    username?: string;
}


export interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (token: string, refreshToken: string, email: string) => Promise<void>;
    logout: () => Promise<void>;
    updateUser: (data: Partial<User>) => Promise<void>;
}

