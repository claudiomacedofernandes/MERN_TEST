"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Serve static files from the storage folder
// For now we serve from the API server, a dedicated server will allow
// a performance improvement
const storagePath = path_1.default.join(__dirname, process.env.STORAGE_PATH || '../storage');
console.log(storagePath);
if (!fs_1.default.existsSync(storagePath)) {
    // Create storage directory if it doesn't exist for photo uploads
    fs_1.default.mkdirSync(storagePath);
}
app.use('/storage', express_1.default.static(storagePath, {
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
app.use(express_1.default.static(path_1.default.join(__dirname, './build')));
app.get('*', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, './build/index.html'));
});
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
