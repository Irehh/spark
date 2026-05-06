import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service.ts';
import { AuthController } from './auth.controller.ts';
import { UserModule } from '../user/user.module.ts';
import { JwtStrategy } from './strategies/jwt.strategy.ts';
import { GoogleStrategy } from './strategies/google.strategy.ts';
import { FacebookStrategy } from './strategies/facebook.strategy.ts';
import { User } from '../user/entities/user.entity.ts';
import { EmailModule } from '../email/email.module.ts';

@Module({
  imports: [
    UserModule,
    PassportModule,
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'spark_secret_key',
      signOptions: { expiresIn: '7d' },
    }),
    EmailModule
  ],
  providers: [AuthService, JwtStrategy, GoogleStrategy, FacebookStrategy],
  controllers: [AuthController],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
