import { Controller, Post, Body, UseGuards, Get } from '@nestjs/common';
import { SubscriptionService } from './subscription.service.ts';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.ts';

// Normally you'd add an @Roles('admin') guard
@Controller('api/admin/features')
@UseGuards(JwtAuthGuard) 
export class AdminFeatureController {
  constructor(private subscriptionService: SubscriptionService) {}

  @Get()
  async getFeatures() {
    return this.subscriptionService.getAllFeatures();
  }

  @Post()
  async updateFeature(
    @Body('featureKey') featureKey: string,
    @Body('isPaid') isPaid: boolean,
    @Body('minimumTierRequired') minimumTierRequired: string,
  ) {
    return this.subscriptionService.setFeatureRequirement(featureKey, isPaid, minimumTierRequired);
  }
}
