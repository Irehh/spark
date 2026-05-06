import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Report, Block } from './entities/safety.entity.ts';
import { SafetyService } from './safety.service.ts';
import { SafetyController } from './safety.controller.ts';

@Module({
  imports: [TypeOrmModule.forFeature([Report, Block])],
  providers: [SafetyService],
  controllers: [SafetyController],
  exports: [SafetyService],
})
export class SafetyModule {}
