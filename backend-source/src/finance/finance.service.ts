import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Wallet } from './entities/wallet.entity.ts';
import { Transaction, TransactionType, TransactionStatus } from './entities/transaction.entity.ts';

@Injectable()
export class FinanceService {
  constructor(
    @InjectRepository(Wallet) private walletRepo: Repository<Wallet>,
    @InjectRepository(Transaction) private txRepo: Repository<Transaction>,
    private dataSource: DataSource,
  ) {}

  async createWallet(userId: string) {
    const wallet = this.walletRepo.create({ user: { id: userId } as any, balance: 0, currency: 'USD' });
    return this.walletRepo.save(wallet);
  }

  async getWallet(userId: string) {
    return this.walletRepo.findOne({ where: { user: { id: userId } }, relations: ['user'] });
  }

  async processTransaction(walletId: string, amount: number, type: TransactionType, reference: string, description: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    
    // SERIALIZABLE high isolation level prevents race conditions and ensures money movement consistency
    await queryRunner.startTransaction('SERIALIZABLE');

    try {
      const wallet = await queryRunner.manager.findOne(Wallet, { 
        where: { id: walletId },
        lock: { mode: 'pessimistic_write' } // Prevent read/writes until transaction completes
      });

      if (!wallet) {
        throw new BadRequestException('Wallet not found');
      }

      if (type === TransactionType.DEBIT && Number(wallet.balance) < amount) {
        throw new BadRequestException('Insufficient funds for debit operation');
      }

      const tx = queryRunner.manager.create(Transaction, {
        wallet,
        type,
        amount,
        currency: wallet.currency,
        status: TransactionStatus.COMPLETED,
        reference,
        description
      });
      await queryRunner.manager.save(tx);

      if (type === TransactionType.CREDIT) {
        wallet.balance = Number(wallet.balance) + Number(amount);
      } else {
        wallet.balance = Number(wallet.balance) - Number(amount);
      }

      await queryRunner.manager.save(wallet);
      await queryRunner.commitTransaction();
      return tx;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}
