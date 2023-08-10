import { Server } from 'socket.io';
import http from 'http';
import { getCode } from './code.service';
import { CorsOptions } from 'cors';

let io: Server;
let cors: CorsOptions

if (process.env.NODE_ENV === 'development') {
  cors = {
    origin: '*',
    methods: ['GET', 'POST']
  }
}

export const socketConnection = (server: http.Server) => {
  io = new Server(server, { cors });

  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    if (socket.handshake.query?.token === 'admin') {
      socket.join('admin');
      console.log(`Moved ${socket.id} to room 'admin'`)
      socket.emit('UPDATE_CODE', getCode())
    }

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  })

}

export const broadcastCode = () =>
  io.to('admin').emit('UPDATE_CODE', getCode());

