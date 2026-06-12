import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { User } from './user/entities/user.entity';
import { Like, Match } from './match/entities/match.entity';
import { Message } from './chat/entities/message.entity';
import { Report, Block } from './safety/entities/safety.entity';
import { Notification } from './notification/entities/notification.entity';
import { DiscoveryModule } from './discovery/discovery.module';
import { ChatModule } from './chat/chat.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { NotificationModule } from './notification/notification.module';
import { SafetyModule } from './safety/safety.module';
import { EmailModule } from './email/email.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { FinanceModule } from './finance/finance.module';

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
