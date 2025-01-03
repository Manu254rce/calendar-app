import { User } from '../types/user_types';
import api from './axios_config'

interface LoginResponse {
    token: string;
    user: User;
}

interface RegisterResponse {
    token: string;
    user: User;
}

export const login = async (user_name: string, password: string): Promise<LoginResponse> => {

    const response = await api.post<LoginResponse>('/auth/login', {
        user_name: user_name,
        password: password,
    });
    if (!response.data.token) {
        throw new Error('Failed to login');
    }

    console.log('Login API response:', response.data);

    const userData: User = {
        id: response.data.user.id,
        _id: response.data.user._id,
        email: response.data.user.email,
        password: response.data.user.password,
        first_name: response.data.user.first_name,
        last_name: response.data.user.last_name,
        user_name: response.data.user.user_name,
        preferences: response.data.user.preferences || '',
        isAdmin: response.data.user.isAdmin,
        user_role: response.data.user.user_role
    }

    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(userData));

    return {
        token: response.data.token,
        user: userData
    };
}

export const register = async (userData: {
    email: string,
    password: string,
    first_name: string,
    last_name: string,
    user_name: string,
    preferences?: string,
    isAdmin?: boolean
}): Promise<RegisterResponse> => {
    const response = await api.post('/auth/register', {
        ...userData, 
        preferences: userData.preferences || ''});

    if (!response.data.token || !response.data.user) {
        throw new Error('Failed to register');
    }

    const registeredUser: User = {
        ...response.data.user,
        preferences: response.data.user.preferences || '',
        isAdmin: response.data.user.isAdmin
    }

    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(registeredUser))
    return response.data;
}

