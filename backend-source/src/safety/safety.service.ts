import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report, Block } from './entities/safety.entity';

@Injectable()
export class SafetyService {
  constructor(
    @InjectRepository(Report)
    private reportRepository: Repository<Report>,
    @InjectRepository(Block)
    private blockRepository: Repository<Block>,
  ) {}

  async reportUser(fromUserId: string, reportedUserId: string, data: any) {
    const report = this.reportRepository.create({
      reporter: { id: fromUserId } as any,
      reported: { id: reportedUserId } as any,
      category: data.category,
      details: data.details,
    });
    return this.reportRepository.save(report);
  }

  async blockUser(fromUserId: string, blockedUserId: string) {
    const block = this.blockRepository.create({
      blocker: { id: fromUserId } as any,
      blocked: { id: blockedUserId } as any,
    });
    return this.blockRepository.save(block);
  }
}
