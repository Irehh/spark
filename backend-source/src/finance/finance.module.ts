import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wallet } from './entities/wallet.entity.ts';
import { Transaction } from './entities/transaction.entity.ts';
import { FinanceService } from './finance.service.ts';
import { FinanceController } from './finance.controller.ts';

@Module({
  imports: [TypeOrmModule.forFeature([Wallet, Transaction])],
  providers: [FinanceService],
  controllers: [FinanceController],
  exports: [FinanceService],
})
export class FinanceModule {}
