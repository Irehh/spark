import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('feature_toggles')
export class FeatureToggle {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  featureKey: string; // e.g., 'super_likes', 'see_who_likes_you', 'rewind'

  @Column({ default: true })
  isPaid: boolean;

  @Column({ nullable: true })
  minimumTierRequired: string; // 'premium' or 'vip'

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
