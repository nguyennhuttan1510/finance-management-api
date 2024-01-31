import { Wallet } from '../entities/wallet.entity';
import { Event } from '../entities/event.entity';
import { Category } from '../entities/category.entity';
import { Moment } from "moment";

export interface TransactionInterface {
  transaction_id: number;
  amount: number;
  balance_of: number;
  category: Category;
  created_date: Date | Moment;
  wallet: Wallet;
  description: string;
  event: Event;
}
