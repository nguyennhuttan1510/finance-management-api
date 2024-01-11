import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Category } from './category.entity';
import { CategoryInterface } from '../interface/category.interface';
import { Expose } from 'class-transformer';
import { Transaction } from './transaction.entity';
import { Event } from './event.entity';

@Entity('SUB_CATEGORY')
export class SubCategory implements Omit<CategoryInterface, 'categories'> {
  @Expose({
    name: 'categoryID',
  })
  @PrimaryGeneratedColumn()
  category_id: CategoryInterface['category_id'];

  @Column('text')
  name: CategoryInterface['name'];

  @Column('text')
  icon: CategoryInterface['icon'];

  @Column({ type: 'integer' })
  type: CategoryInterface['type'];

  @Expose({
    name: 'createDate',
  })
  @CreateDateColumn()
  created_date: CategoryInterface['created_date'];

  @ManyToOne(() => Category, (category) => category.categories)
  category: Category | number;

  @OneToMany(() => Transaction, (transaction) => transaction.category)
  transactions: CategoryInterface['transactions'];

  @OneToMany(() => Event, (event) => event.category, {
    onDelete: 'SET NULL',
  })
  event: Event;
}
