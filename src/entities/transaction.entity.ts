import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { TransactionInterface } from '../interface/transaction.interface';
import { Category } from './category.entity';
import { Expose } from 'class-transformer';
import { Wallet } from './wallet.entity';
import { SubCategory } from './sub-category.entity';
import { Event } from './event.entity';

@Entity('TRANSACTION')
export class Transaction
  implements Omit<TransactionInterface, 'category' | 'wallet' | 'event'>
{
  @Expose({
    name: 'transactionID',
  })
  @PrimaryGeneratedColumn()
  transaction_id: TransactionInterface['transaction_id'];

  @Expose({
    name: 'balanceOf',
  })
  @Column({
    type: 'int',
    default: 0,
  })
  balance_of: TransactionInterface['balance_of'];

  @Column({ type: 'int' })
  amount: TransactionInterface['amount'];

  @Column({
    type: 'text',
    nullable: true,
  })
  description: TransactionInterface['description'];

  @Expose({
    name: 'createdDate',
  })
  @CreateDateColumn()
  created_date: Date;

  @Expose({
    name: 'updatedDate',
  })
  @UpdateDateColumn()
  updated_date: Date;

  @ManyToOne(() => SubCategory, (category) => category.transactions, {
    onDelete: 'SET NULL',
  })
  category: TransactionInterface['category'] | number;

  @ManyToOne(() => Wallet, (wallet) => wallet.transactions, {
    onDelete: 'CASCADE',
  })
  wallet: TransactionInterface['wallet'] | number;

  @ManyToOne(() => Event, (event) => event.transactions)
  event: TransactionInterface['event'] | number;
}
