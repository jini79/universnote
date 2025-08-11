import { Server } from 'socket.io';
import http from 'http';

export function setupSocketServer(server: http.Server) {
  const io = new Server(server, {
    cors: {
      origin: '*', // 실제 배포 시에는 도메인 제한 필요
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`);

    socket.on('message', (data) => {
      console.log('Received message:', data);
      // 필요한 처리 후
      io.emit('message', data); // 모든 클라이언트에 브로드캐스트
    });

    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });

  return io;
}
