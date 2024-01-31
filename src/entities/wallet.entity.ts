import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { StatusWallet, TypeWallet } from '../wallet/dto/create-wallet.dto';
import { Expose } from 'class-transformer';
import {
  AnalyzeWalletInterface,
  AnalyzeWalletSaving,
  WalletAnalyze,
  WalletInterface,
} from '../interface/wallet.interface';
import { Transaction } from './transaction.entity';

@Entity('WALLET')
export class Wallet implements WalletInterface {
  @Expose({ name: 'walletID' })
  @PrimaryGeneratedColumn()
  wallet_id: WalletInterface['wallet_id'];

  @Expose({ name: 'nameWallet' })
  @Column('text')
  name: WalletInterface['name'];

  @Expose({ name: 'balance' })
  @Column('float')
  balance: WalletInterface['balance'];

  @Expose({ name: 'status' })
  @Column('text')
  status: WalletInterface['status'];

  @Expose({ name: 'includeTotal' })
  @Column('boolean')
  is_include_total: WalletInterface['is_include_total'];

  @Expose({ name: 'description' })
  @Column({ type: 'text', nullable: true })
  description: WalletInterface['description'];

  @Expose({ name: 'type' })
  @Column('text')
  type: WalletInterface['type'];

  @Expose({ name: 'members' })
  members: WalletInterface['members'];

  @Expose({
    name: 'targetAmount',
  })
  @Column({ type: 'float', nullable: true, default: null })
  target: number;

  @Expose({
    name: 'startDate',
  })
  @Column({ type: 'timestamp', nullable: true, default: null })
  start_date: Date;

  @Expose({
    name: 'endDate',
  })
  @Column({ type: 'timestamp', nullable: true, default: null })
  end_date: Date;

  @Expose({
    name: 'createDate',
  })
  @CreateDateColumn()
  created_date: WalletInterface['created_date'];

  @Expose({
    name: 'updatedDate',
  })
  @UpdateDateColumn()
  updated_date: WalletInterface['updated_date'];

  @Expose({
    name: 'deletedDate',
  })
  @DeleteDateColumn()
  deleted_date: WalletInterface['deleted_date'];

  @Expose({
    name: 'transactions',
  })
  @OneToMany(() => Transaction, (transaction) => transaction.wallet)
  transactions: WalletInterface['transactions'];

  @Expose({
    name: 'general',
  })
  general: AnalyzeWalletInterface | AnalyzeWalletSaving;
}
