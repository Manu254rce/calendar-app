import express from 'express'
import cors from 'cors'
import connectDB from './config/db'
import eventRoutes from './routes/events'

const app = express();

connectDB();

app.use(cors())
app.use(express.json())

app.use('/api/events', eventRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))