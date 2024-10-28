import express from 'express'
import cors from 'cors'
import connectDB from './config/db'
import eventRoutes from './routes/event_rts'
import userRoutes from './routes/user_rts'
import authRoutes  from './routes/auth_rts'


const app = express();

connectDB();

app.use(cors())
app.use(express.json())

app.use('/api/events', eventRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))