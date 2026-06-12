import { Controller, Post, Body, UseGuards, Request, Headers, Get, Param } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('api/subscriptions')
export class SubscriptionController {
  constructor(private subscriptionService: SubscriptionService) {}

  @Post('checkout')
  @UseGuards(JwtAuthGuard)
  async createCheckout(@Request() req, @Body('tier') tier: string) {
    return this.subscriptionService.createCheckoutSession(req.user.id, tier);
  }

  @Post('webhook')
  async handleWebhook(@Headers('stripe-signature') sig: string, @Body() body: any) {
    return this.subscriptionService.handleWebhook(body);
  }

  @Get('features')
  async getFeatures() {
    return this.subscriptionService.getAllFeatures();
  }
}
