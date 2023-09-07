import { Server } from 'socket.io';
import http from 'http';
import { getCode } from './code.service';
import { CorsOptions } from 'cors';
import { getCurrentEvent, getEventDetails } from './event.service';
import { parse } from 'cookie'
import jwt from 'jsonwebtoken'

const broadcastInterval = Number(process.env.WS_EVENT_BROADCAST_INTERVAL) || 5000
const secret = process.env.JWT_SECRET_KEY || ''

let io: Server;
let cors: CorsOptions

if (process.env.NODE_ENV === 'development') {
  cors = {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
  }
}

export const socketConnection = (server: http.Server) => {
  io = new Server(server, { cors });

  io.on('connection', (socket) => {
    const cookie = socket.request.headers.cookie || ''
    const { token } = parse(cookie)
    let room = 'other'
    
    try {
      jwt.verify(token, secret)
      room = 'admin'
    } catch (error) {
      room = 'other'
    }

    socket.join(room)
    broadcastClientCount()

    socket.on('disconnect', () => {
      broadcastClientCount()
    })
    
    // TODO send to socket only?
    socket.on('CURRENT_EVENT', broadcastCurrentEvent)
    socket.on('UPDATE_CODE', broadcastCode)
    socket.on('WS_CLIENT_COUNT', broadcastClientCount)
  })
}

const broadcastClientCount = () => {
  const admin = io.sockets.adapter.rooms.get('admin')?.size || 0
  const other = io.sockets.adapter.rooms.get('other')?.size || 0
  io.to('admin').emit('WS_CLIENT_COUNT', { admin, other })
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