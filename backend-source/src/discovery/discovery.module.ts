import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity.ts';
import { Like, Match } from './entities/match.entity.ts';
import { DiscoveryService } from './discovery.service.ts';
import { DiscoveryController } from './discovery.controller.ts';

@Module({
  imports: [TypeOrmModule.forFeature([User, Like, Match])],
  providers: [DiscoveryService],
  controllers: [DiscoveryController],
  exports: [DiscoveryService],
})
export class DiscoveryModule {}
