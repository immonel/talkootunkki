import { Server } from 'socket.io';
import http from 'http';
import { getCode } from './code.service';
import { CorsOptions } from 'cors';
import { getCurrentEvent, getEventDetails } from './event.service';

const broadcastInterval = Number(process.env.WS_EVENT_BROADCAST_INTERVAL) || 5000

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
    } else {
      socket.join('other');
    }

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
    
    // TODO send to socket only?
    socket.on('CURRENT_EVENT', broadcastCurrentEvent)
    socket.on('UPDATE_CODE', broadcastCode)
  })
}

export const broadcastCode = () =>
  io.to('admin').emit('UPDATE_CODE', getCode());

export const broadcastCurrentEvent = async () => {
  const currentEvent = await getCurrentEvent()
  if (!currentEvent) {
    return
  }
  const eventDetails = await getEventDetails(currentEvent.event_id)
  io.to('admin').emit('CURRENT_EVENT', eventDetails)
  io.to('other').emit('CURRENT_EVENT', eventDetails?.leaderboards)
}

setInterval(broadcastCurrentEvent, broadcastInterval)