import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from './common/DateTime';
import { Wallet } from './wallet.entity';
import { Event } from './event.entity';

@Entity('USER')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  user_id: number;

  @Column('text')
  last_name: string;

  @Column('text')
  first_name: string;

  @Column('text')
  email: string;

  @ManyToMany(() => Wallet)
  @JoinTable({
    name: 'USERS_WALLETS',
    joinColumn: {
      name: 'user_id',
    },
    inverseJoinColumn: {
      name: 'wallet_id',
    },
  })
  wallets: Wallet[];

  public getFullName() {
    return `${this.first_name} ${this.last_name}`;
  }
}
