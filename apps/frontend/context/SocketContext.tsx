"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { useAuth } from "./AuthContext";
import { initSocket } from "../lib/socket";

export const SocketContext = createContext<Socket | null>(null);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    
    let isMounted = true;
    
    const initializeSocket = async () => {
      try {
        const s = await initSocket();
        if (isMounted && s) {
          setSocket(s);
        }
      } catch (error) {
        // Silent fail in development - backend not available
        if (process.env.NODE_ENV !== 'development') {
          console.warn('Failed to initialize socket:', error);
        }
      }
    };

    // Add a small delay to prevent immediate connection attempts
    const timeoutId = setTimeout(initializeSocket, 1000);

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
      if (socket) {
        socket.disconnect();
      }
    };
  }, [user]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext); 