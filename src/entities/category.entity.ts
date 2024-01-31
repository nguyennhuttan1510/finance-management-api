import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CategoryInterface } from '../interface/category.interface';
import { Expose } from 'class-transformer';
import { Transaction } from './transaction.entity';
import { Event } from './event.entity';

@Entity('CATEGORY')
export class Category implements CategoryInterface {
  @Expose({
    name: 'categoryID',
  })
  @PrimaryGeneratedColumn()
  category_id: CategoryInterface['category_id'];

  @Expose({
    name: 'parentID',
  })
  @Column({ type: 'int', nullable: true, default: null })
  parent_id: CategoryInterface['parent_id'];

  @Column('text')
  name: CategoryInterface['name'];

  @Column('text')
  icon: CategoryInterface['icon'];

  @Column({ type: 'text', nullable: true, default: null })
  description: CategoryInterface['description'];

  @Column({ type: 'int' })
  type: CategoryInterface['type'];

  @Expose({
    name: 'createDate',
  })
  @CreateDateColumn()
  created_date: CategoryInterface['created_date'];

  @OneToMany(() => Transaction, (transaction) => transaction.category, {
    onDelete: 'SET NULL',
  })
  transactions: Transaction[];

  @OneToMany(() => Event, (event) => event.transactions, {
    onDelete: 'SET NULL',
  })
  events: Transaction[];
}
