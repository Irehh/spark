import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subscription } from './entities/subscription.entity';
import { FeatureToggle } from './entities/feature-toggle.entity';
import { SubscriptionService } from './subscription.service';
import { SubscriptionController } from './subscription.controller';
import { AdminFeatureController } from './admin.controller';
import { UserModule } from '../user/user.module';
import { User } from '../user/entities/user.entity';

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
