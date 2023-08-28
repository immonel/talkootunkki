"use client"
import { io } from "socket.io-client";

const WS_URL = import.meta.env.VITE_BACKEND_URL || '';
const token = 'admin'

export const adminSocket = io(WS_URL, {
  query: {token}
});

export const otherSocket = io(WS_URL);