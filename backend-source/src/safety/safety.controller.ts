import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { SafetyService } from './safety.service.ts';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.ts';

@Controller('api/safety')
@UseGuards(JwtAuthGuard)
export class SafetyController {
  constructor(private safetyService: SafetyService) {}

  @Post('report')
  async report(@Request() req, @Body() body: any) {
    return this.safetyService.reportUser(req.user.id, body.reportedUserId, body);
  }

  @Post('block')
  async block(@Request() req, @Body('blockedUserId') blockedUserId: string) {
    return this.safetyService.blockUser(req.user.id, blockedUserId);
  }
}
