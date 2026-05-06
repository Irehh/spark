import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Match } from '../match/entities/match.entity.ts';
import { Message } from './entities/message.entity.ts';
import { ChatGateway } from './chat.gateway.ts';
import { ChatController } from './chat.controller.ts';
import { AuthModule } from '../auth/auth.module.ts';
import { UserModule } from '../user/user.module.ts';

@Module({
  imports: [
    TypeOrmModule.forFeature([Match, Message]),
    AuthModule,
    UserModule,
  ],
  providers: [ChatGateway],
  controllers: [ChatController],
})
export class ChatModule {}
