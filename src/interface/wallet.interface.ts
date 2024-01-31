import { StatusWallet, TypeWallet } from '../wallet/dto/create-wallet.dto';
import { User } from '../entities/user.entity';
import { Transaction } from '../entities/transaction.entity';
import * as diagnostics_channel from 'diagnostics_channel';

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
  start_date: Date;
  end_date: Date;
  target: number;
}

export type AnalyzeWalletInterface = {
  highestCost: number;
  highestIncome: number;
  highestOther: number;
  lowestCost: number;
  lowestIncome: number;
  lowestOther: number;
  totalIncome: number;
  totalCost: number;
  startDate: string;
  endDate: string;
  startAmount: number;
  endAmount: number;
};

export type AnalyzeWalletSaving = {
  remaining: number;
  percentCurrent: number;
  percentTarget: number;
};

export type WalletAnalyze = WalletInterface & {
  general: AnalyzeWalletInterface | AnalyzeWalletSaving;
};
