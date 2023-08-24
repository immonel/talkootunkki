"use client"
import { io } from "socket.io-client";

const WS_URL = process.env.NEXT_PUBLIC_BACKEND_URL || '';
const token = 'admin'

export const adminSocket = io(WS_URL, {
  query: {token}
});

export const otherSocket = io(WS_URL);