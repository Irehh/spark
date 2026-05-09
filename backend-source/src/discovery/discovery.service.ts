import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, In } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { Like, Match } from '../match/entities/match.entity';

@Injectable()
export class DiscoveryService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Like)
    private likeRepository: Repository<Like>,
    @InjectRepository(Match)
    private matchRepository: Repository<Match>,
  ) {}

  async getRecommendedProfiles(userId: string) {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) throw new NotFoundException();

    // Get IDs of people already interacted with
    const interactions = await this.likeRepository.find({
      where: { fromUser: { id: userId } },
      select: ['toUser'],
    });
    const interactedIds = interactions.map(i => i.toUser.id);
    interactedIds.push(userId); // Exclude self

    // Basic Interest-based discovery
    // In a polyglot system, we might use Elasticsearch or Redis for this part
    return this.userRepository.find({
      where: {
        id: Not(In(interactedIds)),
        isActive: true,
      },
      take: 20,
    });
  }

  async handleLike(fromUserId: string, toUserId: string) {
    const fromUser = await this.userRepository.findOneBy({ id: fromUserId });
    const toUser = await this.userRepository.findOneBy({ id: toUserId });

    if (!fromUser || !toUser) throw new NotFoundException();

    // Create like
    const like = this.likeRepository.create({ fromUser, toUser });
    await this.likeRepository.save(like);

    // Check for mutual like (Match logic)
    const mutualLike = await this.likeRepository.findOne({
      where: { fromUser: { id: toUserId }, toUser: { id: fromUserId } },
    });

    if (mutualLike) {
      const match = this.matchRepository.create({ user1: fromUser, user2: toUser });
      await this.matchRepository.save(match);
      return { status: 'match', matchId: match.id };
    }

    return { status: 'liked' };
  }
}
