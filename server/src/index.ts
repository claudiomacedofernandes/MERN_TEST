import express, { Request, Response } from 'express';

const app = express();
const port = 3001;

app.get('/', (_req: Request, res: any) => {
  res.send('Hello from backend');
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});