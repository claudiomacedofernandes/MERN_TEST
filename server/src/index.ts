import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import fs from 'fs';

import authRoutes from './routes/auth.routes';
import photoRoutes from './routes/photo.routes';
import statsRoutes from './routes/stats.routes';

// Loads environment variables from a .env file
dotenv.config();

// Initializes an Express application for handling HTTP requests
const app = express();
const port = process.env.PORT || 3001;

// Enable Cross-Origin Resource Sharing for API access from different domains
app.use(cors({
  credentials: true,
  origin: process.env.NODE_ENV === 'production' ? 'http://localhost:3000' : true
}
));
// Parse incoming JSON request bodies for easy data handling
app.use(express.json());
// Parse cookies from incoming requests for authentication and session management
app.use(cookieParser());

// Serve static files from the storage folder
// For now we serve from the API server, a dedicated server will allow
// a performance improvement
const storagePath = path.join(__dirname, '../storage');
if (!fs.existsSync(storagePath)) {
  // Create storage directory if it doesn't exist for photo uploads
  fs.mkdirSync(storagePath);
}
app.use('/storage', express.static(storagePath, {
  setHeaders: (res, filePath) => {
    // console.log(`Serving file: ${filePath}`);
  },
  fallthrough: true
}));
// Handle 404 for missing files
app.use('/storage', (req, res) => {
  console.error(`File not found: ${req.originalUrl}`);
  res.status(404).json({ message: 'File not found' });
});

// Mounts authentication routes
app.use('/api/auth', authRoutes);
// Mounts photo operations routes
app.use('/api/photos', photoRoutes);
// Mounts stats routes
app.use('/api/stats', statsRoutes);

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