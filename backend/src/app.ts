import express from 'express';
import apiRouter from './routes/api';
import cors from 'cors';
import path from 'path';

const app = express();
const frontendBuildDir = '../dist'

app.use(express.json());
app.use(express.static(path.resolve(__dirname, frontendBuildDir)))

if (process.env.NODE_ENV === 'development')
  app.use(cors());

app.use('/api', apiRouter);

app.get('*', (request, response) =>{
  response.sendFile(path.resolve(__dirname, frontendBuildDir, 'index.html'));
});

export default app