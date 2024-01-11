import { StatusWallet, TypeWallet } from '../wallet/dto/create-wallet.dto';
import { User } from '../entities/user.entity';
import { Transaction } from "../entities/transaction.entity";

export interface WalletInterface {
  wallet_id: number;
  name: string;
  balance: number;
  status: StatusWallet;
  is_include_total: boolean;
  description: string;
  type: TypeWallet;
  members: User[];
  transactions: Transaction[];
  created_date: Date;
  updated_date: Date;
  deleted_date: Date;
}
