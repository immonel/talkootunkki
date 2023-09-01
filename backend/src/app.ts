import express from 'express';
import apiRouter from './routes/api';
import cors, { CorsOptions } from 'cors';
import path from 'path';
import cookieParser from 'cookie-parser'

const app = express();
const frontendBuildDir = '../dist'

const corsOptions: CorsOptions = {
  credentials: true,
  origin: ['http://localhost:3000']
}

app.use(express.json());
app.use(express.static(path.resolve(__dirname, frontendBuildDir)))
app.use(cookieParser());

if (process.env.NODE_ENV === 'development')
  app.use(cors(corsOptions));

app.use('/api', apiRouter);

app.get('*', (request, response) =>{
  response.sendFile(path.resolve(__dirname, frontendBuildDir, 'index.html'));
});

export default app