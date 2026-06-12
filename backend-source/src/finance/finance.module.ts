import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wallet } from './entities/wallet.entity';
import { Transaction } from './entities/transaction.entity';
import { FinanceService } from './finance.service';
import { FinanceController } from './finance.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Wallet, Transaction])],
  providers: [FinanceService],
  controllers: [FinanceController],
  exports: [FinanceService],
})
export class FinanceModule {}
