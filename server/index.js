import express, { json } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import blogRoutes from './routes/blogRoutes.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(json({ limit: '50mb' }));

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27019/midnight_blog').then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('MongoDB connection error:', err);
});

// Auth routes
app.use('/api/auth', authRoutes);

// Blog routes
app.use('/api/blogs', blogRoutes);

const PORT = process.env.PORT || 2500;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});