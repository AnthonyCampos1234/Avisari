import { Server } from 'socket.io';
import http from 'http';

export function initSocketServer(httpServer: http.Server) {
    const io = new Server(httpServer, {
        cors: {
            origin: process.env.NEXT_PUBLIC_BASE_URL,
            methods: ['GET', 'POST'],
        },
    });

    io.on('connection', (socket) => {
        console.log('A user connected');

        socket.on('join-room', (roomId) => {
            socket.join(roomId);
            console.log(`User joined room: ${roomId}`);
        });

        socket.on('leave-room', (roomId) => {
            socket.leave(roomId);
            console.log(`User left room: ${roomId}`);
        });

        socket.on('update-schedule', (data) => {
            socket.to(data.roomId).emit('schedule-updated', data.schedule);
        });

        socket.on('update-cursor', (data) => {
            socket.to(data.roomId).emit('cursor-updated', data.cursor);
        });

        socket.on('disconnect', () => {
            console.log('A user disconnected');
        });
    });

    return io;
}