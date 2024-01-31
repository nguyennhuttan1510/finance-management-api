import { User } from '../entities/user.entity';
import { Transaction } from '../entities/transaction.entity';
import { Category } from '../entities/category.entity';

export interface EventInterface {
  event_id: number;
  name: string;
  category: Category;
  description: string;
  members: User[];
  start_date: Date;
  end_date: Date;
  transactions: Transaction[];
}
