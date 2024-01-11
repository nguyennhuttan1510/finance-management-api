import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EventInterface } from '../interface/event.interface';
import { User } from './user.entity';
import { SubCategory } from './sub-category.entity';
import { Transaction } from './transaction.entity';

@Entity('EVENT')
export class Event implements Omit<EventInterface, 'members' | 'category'> {
  @PrimaryGeneratedColumn()
  event_id: EventInterface['event_id'];

  @Column('text')
  name: EventInterface['name'];

  @Column('text')
  description: EventInterface['description'];

  @CreateDateColumn()
  start_date: EventInterface['start_date'];

  @CreateDateColumn()
  end_date: EventInterface['end_date'];

  @ManyToMany(() => User)
  @JoinTable({
    name: 'EVENTS_USERS',
    joinColumn: {
      name: 'event_id',
    },
    inverseJoinColumn: {
      name: 'user_id',
    },
  })
  members: EventInterface['members'] | number;

  @ManyToOne(() => SubCategory, (category) => category.event)
  category: EventInterface['category'] | number;

  @OneToMany(() => Transaction, (transaction) => transaction.event, {
    onDelete: 'SET NULL',
  })
  transactions: EventInterface['transactions'];
}
