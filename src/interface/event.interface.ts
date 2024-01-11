import { SubCategory } from '../entities/sub-category.entity';
import { User } from '../entities/user.entity';
import { Transaction } from '../entities/transaction.entity';

export interface EventInterface {
  event_id: number;
  name: string;
  category: SubCategory;
  description: string;
  members: User[];
  start_date: Date;
  end_date: Date;
  transactions: Transaction[];
}
