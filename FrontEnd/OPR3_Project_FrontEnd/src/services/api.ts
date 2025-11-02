import type {AuthResponse} from '../types/user';

const API_BASE_URL = 'http://localhost:8080';

// Helper function to get token from localStorage
const getToken = (): string | null => {
    return localStorage.getItem('token');
};

// Helper function to get headers with auth token
const getAuthHeaders = (): HeadersInit => {
    const token = getToken();
    return {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
    };
};

export const api = {
    signup: async (username: string, password: string): Promise<AuthResponse> => {
        const response = await fetch(`${API_BASE_URL}/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        if (!response.ok) {
            if (response.status === 409) {
                throw new Error('Username already exists');
            }
            const errorText = await response.text();
            throw new Error(errorText || 'Signup failed');
        }

        return response.json();
    },

    login: async (username: string, password: string): Promise<AuthResponse> => {
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('Invalid username or password');
            }
            const errorText = await response.text();
            throw new Error(errorText || 'Login failed');
        }

        return response.json();
    },

    verifyToken: async (): Promise<AuthResponse> => {
        const token = getToken();
        if (!token) {
            throw new Error('No token found');
        }

        const response = await fetch(`${API_BASE_URL}/verify`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error('Token verification failed');
        }

        return response.json();
    },

    // Example of a protected endpoint
    getProtectedData: async () => {
        const response = await fetch(`${API_BASE_URL}/some-protected-endpoint`, {
            method: 'GET',
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('Unauthorized');
            }
            throw new Error('Request failed');
        }

        return response.json();
    },
};