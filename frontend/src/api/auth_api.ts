import api from './axios_config'

export const login = async (user_name: string, password: string) => {
    const response = await api.post('/auth/login', {
        user_name: user_name,
        password: password,
    });
    if (!response.data.token) {
        throw new Error('Failed to login');
    }

    return response.data;
}

export const register = async (userData: {
    email: string, 
    password: string, 
    first_name: string, 
    last_name: string, 
    user_name: string
}) => {
    const response = await api.post('/auth/register', userData);
    
    if (response.data.token) {
        localStorage.setItem('token', response.data.token);
    }
    return response.data;
}

