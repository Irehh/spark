import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Match } from '../match/entities/match.entity';
import { Message } from './entities/message.entity';
import { ChatGateway } from './chat.gateway';
import { ChatController } from './chat.controller';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';

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
