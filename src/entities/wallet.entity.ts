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
import { WalletInterface } from '../interface/wallet.interface';
import { Transaction } from './transaction.entity';

@Entity('WALLET')
export class Wallet implements WalletInterface {
  @Expose({ name: 'walletID' })
  @PrimaryGeneratedColumn()
  wallet_id: WalletInterface['wallet_id'];

  @Expose({ name: 'nameWallet' })
  @Column('text')
  name: WalletInterface['name'];

  @Column('float')
  balance: WalletInterface['balance'];

  @Column('text')
  status: WalletInterface['status'];

  @Expose({ name: 'includeTotal' })
  @Column('boolean')
  is_include_total: WalletInterface['is_include_total'];

  @Column('text')
  description: WalletInterface['description'];

  @Column('text')
  type: WalletInterface['type'];

  members: WalletInterface['members'];

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

  @OneToMany(() => Transaction, (transaction) => transaction.wallet)
  transactions: WalletInterface['transactions'];
}
