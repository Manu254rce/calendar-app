import { Request, Response } from "express";
import jwt from 'jsonwebtoken'
import User from '../models/user_mdls'

const JWT_SECRET = process.env.JWT_SECRET || '1251591768200a3b1715a224ba2fc601b50b18ff1ded1da8b1e41358afefffa780a67df1f59fe01c5ea75fa0a32ccec48952f89cd3dc89a124621d4dce75719b'

export const register = async (req: Request, res: Response) => {
    try {
        const { email, password, first_name, last_name, user_name } = req.body

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' })
        }

        const user = new User({ email, password, first_name, last_name, user_name })
        await user.save()

        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '24h' })

        res.status(201).json({
            token, user: {
                id: user._id,
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name,
                user_name: user.user_name
            }
        })
    } catch (error) {
        res.status(500).json({ message: 'Error creating user' })

    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { user_name, password } = req.body

        const user = await User.findOne({ user_name });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' })
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' })
        }

        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '24h' })

        res.json({
            token, user: {
                id: user._id,
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name,
                user_name: user.user_name
            }
        })
    } catch (error) {
        res.status(500).json({ message: 'Error logging in' })

    }
};

