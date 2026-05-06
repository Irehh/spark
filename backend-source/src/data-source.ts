import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from './user/entities/user.entity.ts';
import { Like, Match } from './match/entities/match.entity.ts';
import { Message } from './chat/entities/message.entity.ts';
import { Report, Block } from './safety/entities/safety.entity.ts';
import { Notification } from './notification/entities/notification.entity.ts';
import { Subscription } from './subscription/entities/subscription.entity.ts';
import { FeatureToggle } from './subscription/entities/feature-toggle.entity.ts';
import { Wallet } from './finance/entities/wallet.entity.ts';
import { Transaction } from './finance/entities/transaction.entity.ts';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: +(process.env.DB_PORT || 5432),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'spark_db',
  synchronize: false, // Ensures TypeORM does not auto-sync schema, forcing manual migrations
  logging: true,
  entities: [
    User, Like, Match, Message, Report, Block, Notification, 
    Subscription, FeatureToggle, Wallet, Transaction
  ],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  subscribers: [],
});
