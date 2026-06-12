import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { FinanceService } from './finance.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TransactionType } from './entities/transaction.entity';

@Controller('api/finance')
@UseGuards(JwtAuthGuard)
export class FinanceController {
  constructor(private financeService: FinanceService) {}

  @Get('wallet')
  async getWallet(@Request() req) {
    let wallet = await this.financeService.getWallet(req.user.id);
    if (!wallet) {
      wallet = await this.financeService.createWallet(req.user.id);
    }
    return wallet;
  }

  @Post('deposit')
  async deposit(@Request() req, @Body('amount') amount: number, @Body('reference') reference: string) {
    const wallet = await this.financeService.getWallet(req.user.id);
    return this.financeService.processTransaction(wallet.id, amount, TransactionType.CREDIT, reference, 'Deposit via card');
  }

  @Post('spend')
  async spend(@Request() req, @Body('amount') amount: number, @Body('description') description: string) {
    const wallet = await this.financeService.getWallet(req.user.id);
    return this.financeService.processTransaction(wallet.id, amount, TransactionType.DEBIT, \`SPEND_\${Date.now()}\`, description);
  }
}
