import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import cors from 'cors';

import authRoutes from './routes/auth.routes';

// Loads environment variables from a .env file
dotenv.config();

// Initializes an Express application for handling HTTP requests
const app = express();
const port = process.env.PORT || 3001;

// Enable Cross-Origin Resource Sharing for API access from different domains.
app.use(cors());
// Parse incoming JSON request bodies for easy data handling
app.use(express.json());
// Parse cookies from incoming requests for authentication and session management.
app.use(cookieParser());

// Mounts authentication routes
app.use('/api/auth', authRoutes);

// Establishes a connection to a MongoDB database
mongoose.connect(process.env.MONGO_URI!, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        // Starts the Express server
        app.listen(port, () => {
            console.log(`Server running on http://localhost:${port}`);
        });
    })
    .catch((err: Error) => {
        console.error('DB connection error:', err);
    });