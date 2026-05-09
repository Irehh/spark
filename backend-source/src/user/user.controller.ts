import { Controller, Get, Put, Post, Body, UseGuards, Request } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('api/users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private userService: UserService) {}

  @Get('me')
  async getMe(@Request() req) {
    return this.userService.findOne(req.user.id);
  }

  @Put('profile')
  async updateProfile(@Request() req, @Body() updateData: any) {
    return this.userService.updateProfile(req.user.id, updateData);
  }

  @Put('location')
  async updateLocation(@Request() req, @Body() body: { lat: number, lng: number }) {
    return this.userService.setLocation(req.user.id, body.lat, body.lng);
  }

  @Put('interests')
  async updateInterests(@Request() req, @Body('interests') interests: string[]) {
    return this.userService.updateInterests(req.user.id, interests);
  }

  @Put('push-token')
  async updatePushToken(@Request() req, @Body('token') token: string) {
    return this.userService.updatePushToken(req.user.id, token);
  }

  @Post('sync-offline')
  async syncOfflineActions(@Request() req, @Body('actions') actions: any[]) {
    return this.userService.syncOfflineActions(req.user.id, actions);
  }
}
