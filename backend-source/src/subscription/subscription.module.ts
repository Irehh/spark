import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subscription } from './entities/subscription.entity.ts';
import { FeatureToggle } from './entities/feature-toggle.entity.ts';
import { SubscriptionService } from './subscription.service.ts';
import { SubscriptionController } from './subscription.controller.ts';
import { AdminFeatureController } from './admin.controller.ts';
import { UserModule } from '../user/user.module.ts';
import { User } from '../user/entities/user.entity.ts';

@Module({
  imports: [
    TypeOrmModule.forFeature([Subscription, FeatureToggle, User]),
    UserModule,
  ],
  providers: [SubscriptionService],
  controllers: [SubscriptionController, AdminFeatureController],
  exports: [SubscriptionService],
})
export class SubscriptionModule {}
