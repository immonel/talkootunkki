import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import http from 'http';
import { socketConnection } from './services/socket.service';
import { sequelize } from './services/db.service';
import { modelsReady } from './models';

const port = process.env.PORT || '';

const server = http.createServer(app);
socketConnection(server);

const start = async () => {
  await sequelize.authenticate()
  console.log('[sequelize] Connection to database has been established successfully.')
  await modelsReady

  server.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`)
  })
}

start().catch((error) => {
  console.error('[server] Failed to start:', error)
  process.exit(1)
})
