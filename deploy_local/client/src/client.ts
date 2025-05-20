import express from 'express';
import createProxyMiddleware from 'http-proxy-middleware';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Proxy API requests
app.use('/api', createProxyMiddleware({
  target: 'http://localhost:3001', // Your API server
  changeOrigin: true,
}));

// Serve static files from the storage folder
// For now we serve from the API server, a dedicated server will allow
// a performance improvement
const storagePath = path.join(__dirname, process.env.STORAGE_PATH || '../storage');
console.log(storagePath);
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

// Serve React Client
app.use(express.static(path.join(__dirname, './build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './build/index.html'));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));