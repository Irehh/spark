import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '../user/entities/user.entity.ts';

export enum ReportCategory {
  HARASSMENT = 'harassment',
  FAKE = 'fake_profile',
  INAPPROPRIATE = 'inappropriate_content',
  UNDERAGE = 'underage',
  SOLICITATION = 'solicitation',
}

@Entity('reports')
export class Report {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  reporter: User;

  @ManyToOne(() => User)
  reported: User;

  @Column({ type: 'enum', enum: ReportCategory })
  category: ReportCategory;

  @Column({ type: 'text', nullable: true })
  details: string;

  @CreateDateColumn()
  createdAt: Date;
}

@Entity('blocks')
export class Block {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  blocker: User;

  @ManyToOne(() => User)
  blocked: User;

  @CreateDateColumn()
  createdAt: Date;
}
