import { Controller, Get, Post, Body, UseGuards, Request, Param } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.ts';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity.ts';

@Controller('api/notifications')
@UseGuards(JwtAuthGuard)
export class NotificationController {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
  ) {}

  @Get()
  async getNotifications(@Request() req) {
    return this.notificationRepository.find({
      where: { user: { id: req.user.id } },
      order: { createdAt: 'DESC' }
    });
  }

  @Post(':id/read')
  async markAsRead(@Param('id') id: string) {
    return this.notificationRepository.update(id, { isRead: true });
  }
}
