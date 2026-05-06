import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service.ts';

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: 'chat',
})
@Injectable()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(
    private jwtService: JwtService,
    private userService: UserService
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token;
      const payload = await this.jwtService.verifyAsync(token);
      client.data.userId = payload.sub;
      client.join(`user_${payload.sub}`);
      
      // Update online status
      await this.userService.setOnlineStatus(payload.sub, true);
      console.log(`User ${payload.sub} connected`);
    } catch (e) {
      client.disconnect();
    }
  }

  async handleDisconnect(client: Socket) {
    if (client.data.userId) {
      // Set offline status
      await this.userService.setOnlineStatus(client.data.userId, false);
      console.log(`User ${client.data.userId} disconnected`);
    }
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(client: Socket, payload: { matchId: string; receiverId: string; text: string }) {
    // Save to DB via service (not shown for brevity in this specific file)
    // Then emit to participants
    this.server.to(`user_${payload.receiverId}`).emit('newMessage', {
      senderId: client.data.userId,
      text: payload.text,
      matchId: payload.matchId,
      timestamp: new Date()
    });
  }

  @SubscribeMessage('typing')
  handleTyping(client: Socket, payload: { matchId: string; receiverId: string; }) {
    this.server.to(`user_${payload.receiverId}`).emit('typing', {
      senderId: client.data.userId,
      matchId: payload.matchId
    });
  }

  @SubscribeMessage('stopTyping')
  handleStopTyping(client: Socket, payload: { matchId: string; receiverId: string; }) {
    this.server.to(`user_${payload.receiverId}`).emit('stopTyping', {
      senderId: client.data.userId,
      matchId: payload.matchId
    });
  }
}
