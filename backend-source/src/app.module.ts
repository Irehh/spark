import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { User } from './user/entities/user.entity.ts';
import { Like, Match } from './match/entities/match.entity.ts';
import { Message } from './chat/entities/message.entity.ts';
import { Report, Block } from './safety/entities/safety.entity.ts';
import { Notification } from './notification/entities/notification.entity.ts';
import { DiscoveryModule } from './discovery/discovery.module.ts';
import { ChatModule } from './chat/chat.module.ts';
import { AuthModule } from './auth/auth.module.ts';
import { UserModule } from './user/user.module.ts';
import { NotificationModule } from './notification/notification.module.ts';
import { SafetyModule } from './safety/safety.module.ts';
import { EmailModule } from './email/email.module.ts';
import { SubscriptionModule } from './subscription/subscription.module.ts';
import { FinanceModule } from './finance/finance.module.ts';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 100, // 100 requests per minute per IP
    }]),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: +(process.env.DB_PORT || 5432),
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME || 'spark_db',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: false, // Turn off synchronize in favor of migrations
    }),
    AuthModule,
    UserModule,
    DiscoveryModule,
    ChatModule,
    NotificationModule,
    SafetyModule,
    EmailModule,
    SubscriptionModule,
    FinanceModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
