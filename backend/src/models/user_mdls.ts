import mongoose, { Document, Schema } from "mongoose";
import bcrypt from 'bcryptjs'

export interface IUser extends Document {
    _id: string
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    user_name: string;
    comparePassword(candidatePassword: string) : Promise<boolean>;
}

const userSchema: Schema = new Schema({
    email: {
        type: String, 
        required: true, 
        unique: true, 
        trim: true, 
        lowercase: true
    },

    password: {
        type: String,
        required: true,
        minlength: 6
    },

    first_name: {
        type: String,
        required: true,
        trim: true
    },

    last_name: {
        type: String,
        required: true,
        trim: true
    },

    user_name: {
        type: String,
        required: true,
        trim: true
    }
}, {timestamps: true});

userSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        const user = this as unknown as IUser;
        user.password = await bcrypt.hash(user.password, 10)
    }
    next();
})

userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password)
}

export default mongoose.model<IUser>('User', userSchema)