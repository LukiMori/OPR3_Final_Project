import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type {User, AuthResponse} from '../types/user';
import { api } from '../services/api';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (authResponse: AuthResponse) => void;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // Verify token on mount
    useEffect(() => {
        const verifyToken = async () => {
            const token = localStorage.getItem('token');

            if (token) {
                try {
                    const authResponse = await api.verifyToken();
                    setUser({
                        id: authResponse.id,
                        username: authResponse.username,
                    });
                } catch (error) {
                    // Token is invalid, clear it
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                }
            }

            setLoading(false);
        };

        verifyToken();
    }, []);

    const login = (authResponse: AuthResponse) => {
        localStorage.setItem('token', authResponse.token);
        localStorage.setItem('user', JSON.stringify({
            id: authResponse.id,
            username: authResponse.username,
        }));
        setUser({
            id: authResponse.id,
            username: authResponse.username,
        });
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                logout,
                isAuthenticated: !!user,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};