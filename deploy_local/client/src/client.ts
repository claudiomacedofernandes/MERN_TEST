import express from 'express';
import createProxyMiddleware from 'http-proxy-middleware';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

const LOG_LOC = "CONSOLE"; // null | "CONSOLE" | "./logs/log.txt"; 

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

const API_SERVER = process.env.REACT_APP_SERVER_API || 'http://localhost:3001';
logToFile(`Starging client v1.2 with API_SERVER: ${API_SERVER}\n`);

// Log middleware for /api requests
if (LOG_LOC !== null) {
  // Log requests
  app.use('/api', (req, res, next) => {
    logToFile(`API request called: ${req.method} ${req.originalUrl} at ${new Date().toISOString()}\n`);
    next(); // Pass control to the proxy middleware
  });
  // Proxy API requests
  app.use('/api', createProxyMiddleware({
    target: API_SERVER, // Your API server
    changeOrigin: true,
    onProxyReq: (proxyReq, req, res) => {
      // Log the proxied URL
      const proxiedUrl = `${proxyReq.protocol}//${proxyReq.host}${proxyReq.path}`;
      const resultUrl = `${API_SERVER}${proxyReq.path}`;
      logToFile(`Proxied URL: ${proxiedUrl} ->  ${resultUrl} at ${new Date().toISOString()}\n`);
    },
  }));
} else {
  // Proxy API requests
  app.use('/api', createProxyMiddleware({
    target: API_SERVER, // Your API server
    changeOrigin: true
  }));
}

// Serve static files from the storage folder
// For now we serve from the API server, a dedicated server will allow
// a performance improvement
const storagePath = path.join(__dirname, process.env.STORAGE_PATH || '../storage');
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
// Example server start
app.listen(3000, () => {
  logToFile(`Starting client with API_SERVER: ${API_SERVER} at ${new Date().toISOString()}\n`);
  console.log('Server running on port 3000');
});

function logToFile(msg: string) {
  if (!LOG_LOC) {
    return;
  }

  if(LOG_LOC === "CONSOLE") {
    console.log(msg);
    return;
  }

  fs.appendFileSync(LOG_LOC, msg);
}