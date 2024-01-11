import { Wallet } from '../entities/wallet.entity';
import { SubCategory } from '../entities/sub-category.entity';
import { Event } from '../entities/event.entity';

export interface TransactionInterface {
  transaction_id: number;
  amount: number;
  balance_of: number;
  category: SubCategory;
  created_date: Date;
  wallet: Wallet;
  description: string;
  event: Event;
}
