import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "../types/user_types";
interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (token: string, userData: User) => void;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(() => {
        try {
            const storedUser = localStorage.getItem('user');
            console.log('Initial user from localStorage:', storedUser)
            return storedUser ? JSON.parse(storedUser) : null;
        } catch (error) {
            console.error('Error parsing stored user:', error);
            return null;
        }
    });
    const [token, setToken] = useState<string | null>(() => {
        return localStorage.getItem('token')
    });

    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!token)

    const login = (token: string, userData: User) => {
        try {
            if (!token) {
                throw new Error('Invalid token');
            }
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userData));
            console.log('Storing user data:', userData);

            setToken(token);
            setUser(userData);
            setIsAuthenticated(true)
        } catch (error) {
            console.error('Login error in context:', error);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setToken(null);
            setUser(null);
            throw error;
        }
    }

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
    }

    useEffect(() => {
        console.log('Current user in context:', user);
    }, [user])

    return (
        <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    )

}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    return context;
}