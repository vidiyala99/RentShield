import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
    id: string;
    email: string;
    full_name: string;
}

interface AuthState {
    user: User | null;
    accessToken: string | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string, fullName: string) => Promise<void>;
    logout: () => void;
}

export const useAuth = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            accessToken: null,
            isAuthenticated: false,

            login: async (email, password) => {
                const formData = new FormData();
                formData.append('username', email);
                formData.append('password', password);

                const response = await fetch('http://localhost:8000/auth/login', {
                    method: 'POST',
                    body: formData,
                });

                if (!response.ok) {
                    const err = await response.json();
                    throw new Error(err.detail || 'Login failed');
                }

                const data = await response.json();
                set({
                    user: data.user,
                    accessToken: data.access_token,
                    isAuthenticated: true,
                });
            },

            register: async (email, password, fullName) => {
                const response = await fetch('http://localhost:8000/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password, full_name: fullName }),
                });

                if (!response.ok) {
                    const err = await response.json();
                    throw new Error(err.detail || 'Registration failed');
                }

                const data = await response.json();
                set({
                    user: data.user,
                    accessToken: data.access_token,
                    isAuthenticated: true,
                });
            },

            logout: () => {
                set({ user: null, accessToken: null, isAuthenticated: false });
            },
        }),
        { name: 'auth-storage' }
    )
);
