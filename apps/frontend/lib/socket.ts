import { io, Socket } from 'socket.io-client';
import { getAuth } from 'firebase/auth';
import { ClientToServerEvents, ServerToClientEvents } from 'types';
import { checkBackendAvailability } from './backend-check';

let socket: Socket<ServerToClientEvents, ClientToServerEvents> | null = null;
let connectionAttempted = false;

export const initSocket = async () => {
  // Prevent multiple connection attempts
  if (connectionAttempted) {
    return socket;
  }
  
  connectionAttempted = true;
  
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return null;
    
    // Check if backend is available before attempting connection
    const backendAvailable = await checkBackendAvailability();
    if (!backendAvailable) {
      if (process.env.NODE_ENV === 'development') {
        console.info('Socket connection skipped (backend not available)');
      }
      return null;
    }
    
    const token = await user.getIdToken();
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001';
    
    socket = io(socketUrl, {
      auth: { token },
      autoConnect: false,
      transports: ['websocket', 'polling'],
      timeout: 3000, // Reduced timeout
      reconnection: false, // Disable reconnection to prevent spam
    });

    // Handle connection errors silently in development
    socket.on('connect_error', (error) => {
      if (process.env.NODE_ENV === 'development') {
        // Only log once per session to reduce console noise
        if (!window.__socketErrorLogged) {
          console.info('Socket connection unavailable (backend not running)');
          window.__socketErrorLogged = true;
        }
      }
    });

    socket.on('connect', () => {
      console.log('Socket connected successfully');
    });

    socket.connect();
    return socket;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.info('Socket initialization skipped (backend not available)');
    }
    return null;
  }
};

export const getSocket = () => socket;

// Add type declaration for the global flag
declare global {
  interface Window {
    __socketErrorLogged?: boolean;
  }
} 