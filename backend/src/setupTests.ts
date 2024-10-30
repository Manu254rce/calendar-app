import mongoose from 'mongoose'
import UserModel from './models/user_mdls'
import bcrypt from 'bcryptjs'

export const setupTestUser = async () => {
    const testUser = {
        email: 'test@example.com',
        password: await bcrypt.hash('testpassword123', 10),
        first_name: 'Test',
        last_name: 'User',
        user_name: 'testuser'
    }

    await UserModel.findOneAndUpdate(
        { email: testUser.email },
        testUser,
        { upsert: true }
    )
}