import { Controller, Get, Param, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.ts';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity.ts';

@Controller('api/chat')
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
  ) {}

  @Get(':matchId')
  async getHistory(@Param('matchId') matchId: string) {
    return this.messageRepository.find({
      where: { match: { id: matchId } },
      relations: ['sender'],
      order: { createdAt: 'ASC' }
    });
  }
}
