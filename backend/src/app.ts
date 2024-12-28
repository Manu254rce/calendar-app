import express from 'express'
import cors from 'cors'
import connectDB from './config/db'
import eventRoutes from './routes/event_rts'
import userRoutes from './routes/user_rts'
import authRoutes from './routes/auth_rts'
import adminRoutes from './routes/admin_rts'
import commentRoutes from './routes/comment_rts'

export function startApp() {
    const app = express();

    connectDB();

    app.use(cors())
    app.use(express.json());

    app.get('/', (req, res) => {
        res.send('Backend server is running');
    });

    app.use('/api/events', eventRoutes);
    app.use('/api/users', userRoutes);
    app.use('/api/auth', authRoutes);
    app.use('/api', commentRoutes);
    app.use('/api/admin', adminRoutes);

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
        .on('error', (error) => {
            console.error('Error starting server:', error);
        });
}

startApp();