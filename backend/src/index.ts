import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import http from 'http';
import { socketConnection } from './services/socket.service';
import { sequelize } from './services/db.service';

const port = process.env.PORT || '';

const server = http.createServer(app);
socketConnection(server);

sequelize.authenticate()
.then(() => {
  console.log('[sequelize] Connection to database has been established successfully.');
})
.catch((error) => {
  console.error('[sequelize] Unable to connect to the database:', error);
});

server.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});