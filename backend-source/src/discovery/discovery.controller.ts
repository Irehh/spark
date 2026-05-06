import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { DiscoveryService } from './discovery.service.ts';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.ts';

@Controller('api/discovery')
@UseGuards(JwtAuthGuard)
export class DiscoveryController {
  constructor(private discoveryService: DiscoveryService) {}

  @Get()
  async getFeed(@Request() req) {
    return this.discoveryService.getRecommendedProfiles(req.user.id);
  }

  @Post('like')
  async like(@Request() req, @Body('targetId') targetId: string) {
    return this.discoveryService.handleLike(req.user.id, targetId);
  }
}
