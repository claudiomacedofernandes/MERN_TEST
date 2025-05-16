import express, { Request, Response } from 'express';
import cors from 'cors';

const app = express();
const port = 3001;

// Allow requests from your frontend (http://localhost:3000 by default)
app.use(cors());

app.get('/api/message', (_req: Request, res: any) => {
    res.json({ message: 'Hello from the backend!' });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});