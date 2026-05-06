import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity.ts';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findOne(id: string): Promise<User | undefined> {
    return this.userRepository.findOneBy({ id });
  }

  async updateProfile(id: string, updateData: Partial<User>) {
    await this.userRepository.update(id, updateData);
    return this.findOne(id);
  }

  async setLocation(id: string, lat: number, lng: number) {
    // Spatial positioning logic
    const point = `(${lat},${lng})`;
    await this.userRepository.update(id, { location: point });
    return { success: true };
  }

  async updateInterests(id: string, interests: string[]) {
    await this.userRepository.update(id, { interests });
    return { success: true, interests };
  }

  async updatePushToken(id: string, pushToken: string) {
    await this.userRepository.update(id, { pushToken });
    return { success: true };
  }

  async setOnlineStatus(id: string, isOnline: boolean) {
    await this.userRepository.update(id, { isOnline, lastSeen: new Date() });
  }

  async syncOfflineActions(id: string, actions: any[]) {
    // Process an array of actions queued while user was offline (e.g. swipes, messages)
    let syncedCount = 0;
    for (const action of actions) {
      console.log(`[Offline Sync] Processing action for user ${id}:`, action.type);
      // Example: if (action.type === 'LIKE') { ... }
      syncedCount++;
    }
    return { success: true, syncedCount, un-synced: 0 };
  }
}
