import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import io, { Socket } from 'socket.io-client';

interface SocketContextType {
    socket: Socket | null;
    joinRoom: (roomId: string) => void;
    leaveRoom: (roomId: string) => void;
}

const SocketContext = createContext<SocketContextType>({
    socket: null,
    joinRoom: () => { },
    leaveRoom: () => { },
});

export const useSocket = () => useContext(SocketContext);

interface SocketProviderProps {
    children: ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        const newSocket = io(process.env.NEXT_PUBLIC_BASE_URL as string);
        setSocket(newSocket);

        return () => {
            newSocket.close();
        };
    }, []);

    const joinRoom = (roomId: string) => {
        if (socket) {
            socket.emit('join-room', roomId);
        }
    };

    const leaveRoom = (roomId: string) => {
        if (socket) {
            socket.emit('leave-room', roomId);
        }
    };

    return (
        <SocketContext.Provider value={{ socket, joinRoom, leaveRoom }}>
            {children}
        </SocketContext.Provider>
    );
};