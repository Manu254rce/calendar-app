import { Request, Response } from "express";
import jwt from 'jsonwebtoken'
import User from '../models/user_mdls'

const JWT_SECRET = process.env.JWT_SECRET || '1251591768200a3b1715a224ba2fc601b50b18ff1ded1da8b1e41358afefffa780a67df1f59fe01c5ea75fa0a32ccec48952f89cd3dc89a124621d4dce75719b'

export const register = async (req: Request, res: Response) => {
    try {
        const { email, password, first_name, last_name, user_name, isAdmin } = req.body

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: existingUser.email === email 
                ?'Email already in use'
                : 'Username already taken' })
        }

        const user = new User({ email, password, first_name, last_name, user_name, isAdmin })
        await user.save()

        const token = jwt.sign({ id: user._id.toString(), email: user.email, isAdmin: user.isAdmin }, JWT_SECRET, { expiresIn: '24h' })

        res.status(201).json({
            token, user: {
                id: user._id,
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name,
                user_name: user.user_name,
                isAdmin: user.isAdmin
            }
        })
    } catch (error) {
        res.status(500).json({ 
            message: error instanceof Error 
                ? error.message 
                : 'Error creating user' 
        });        
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { user_name, password } = req.body

        const user = await User.findOne({ user_name });
        if (!user) {
            return res.status(401).json({ message: 'Invalid username' })
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid password' })
        }

        const token = jwt.sign({ userId: user._id, isAdmin: user.isAdmin }, JWT_SECRET, { expiresIn: '24h' })

        res.json({
            token, user: {
                id: user._id,
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name,
                user_name: user.user_name,
                isAdmin: user.isAdmin
            }
        })
    } catch (error) {
        res.status(500).json({ message: 'Error logging in' })

    }
};

export const logout = async (req: Request, res: Response) => {
    try {
        res.status(200).json({message: 'Logged out successfully'});
    } catch (error) {
        res.status(500).json({ message: 'Error during logout' });
    }
}

