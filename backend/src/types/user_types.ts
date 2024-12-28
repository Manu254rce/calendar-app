import { Request } from 'express';

export interface User {
    id: string;
    _id?: string;
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    user_name: string;
    preferences?: string;
    user_role?: string;
    isAdmin?: boolean;
}

export interface AuthRequest extends Request {
    user?: {
        userId: string;
        id: string;
        email?: string;
        user_name?: string;
        isAdmin?: boolean;
    }
}