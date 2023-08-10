import express, { Request, Response } from 'express';
import apiRouter from './routes/api';
import cors from 'cors';

const app = express();

app.use(express.json());

if (process.env.NODE_ENV === 'development')
  app.use(cors());

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

app.use('/api', apiRouter);

export default app