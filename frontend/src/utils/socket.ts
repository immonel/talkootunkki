import { io } from "socket.io-client";

const WS_URL = import.meta.env.VITE_BACKEND_URL || '';

export const socket = io(WS_URL, {
  withCredentials: true
});