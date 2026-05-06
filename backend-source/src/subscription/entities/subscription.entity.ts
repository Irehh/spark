import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity.ts';

@Entity('subscriptions')
export class Subscription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  user: User;

  @Column()
  stripeCustomerId: string;

  @Column({ nullable: true })
  stripeSubscriptionId: string;

  @Column()
  tier: string; // 'premium', 'vip'

  @Column()
  status: string; // 'active', 'canceled', 'past_due'

  @Column({ type: 'timestamp' })
  currentPeriodEnd: Date;

  @CreateDateColumn()
  createdAt: Date;
}
