import mongoose from "mongoose";
import dotenv from 'dotenv'

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://admin:ManuLamo254rce@serverlessinstance0.xp8aboh.mongodb.net/')
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Connection error: ', error);
        process.exit(1);
    }
}

setInterval(connectDB, 30000);

export default connectDB;