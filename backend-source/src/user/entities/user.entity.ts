import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, OneToMany } from 'typeorm';

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  NON_BINARY = 'non_binary',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true, select: false })
  password?: string;

  @Column()
  fullName: string;

  @Column({ type: 'date' })
  birthDate: Date;

  @Column({ type: 'enum', enum: Gender, nullable: true })
  gender: Gender;

  @Column({ nullable: true })
  googleId: string;

  @Column({ nullable: true })
  facebookId: string;

  @Column({ nullable: true })
  verificationToken: string;

  @Column({ nullable: true })
  resetPasswordToken: string;

  @Column({ nullable: true })
  resetPasswordExpires: Date;

  @Column({ default: 'free' })
  subscriptionTier: string; // 'free', 'premium', 'vip'

  @Column({ type: 'text', nullable: true })
  bio: string;

  @Column('simple-array', { nullable: true })
  images: string[];

  @Column('simple-json', { nullable: true })
  prompts: { question: string; answer: string }[];

  @Column('simple-array', { nullable: true })
  interests: string[];

  @Column({ nullable: true })
  pushToken: string;

  @Column({ default: false })
  isOnline: boolean;

  @Column({ nullable: true })
  lastSeen: Date;

  @Column({ type: 'point', nullable: true })
  location: string; // Store as 'LAT,LNG' or GEOGRAPHY

  @Column({ default: false })
  isVerified: boolean;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
