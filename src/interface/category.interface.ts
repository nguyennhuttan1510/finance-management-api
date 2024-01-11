import { SubCategory } from '../entities/sub-category.entity';
import { Transaction } from '../entities/transaction.entity';

export enum CategoryType {
  'COST' = 1,
  'INCOME',
  'OTHER',
}

export interface CategoryInterface {
  category_id: number;
  name: string;
  icon: string;
  type: CategoryType;
  created_date: Date;
  transactions?: Transaction[];
}
