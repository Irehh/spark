import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Or } from 'typeorm';
import { Match } from './entities/match.entity';

@Controller('api/matches')
@UseGuards(JwtAuthGuard)
export class MatchesController {
  constructor(
    @InjectRepository(Match)
    private matchRepository: Repository<Match>,
  ) {}

  @Get()
  async getMatches(@Request() req) {
    const userId = req.user.id;
    return this.matchRepository.find({
      where: [
        { user1: { id: userId } },
        { user2: { id: userId } }
      ],
      relations: ['user1', 'user2'],
      order: { createdAt: 'DESC' }
    });
  }
}
