import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { TransactionInterface } from '../../interface/transaction.interface';
import { CategoryType } from '../../interface/category.interface';

export class CreateTransactionDto
  implements
    Partial<Omit<TransactionInterface, 'wallet' | 'category' | 'event'>>
{
  @IsNumber()
  amount: TransactionInterface['amount'];

  @IsOptional()
  @IsDateString()
  created_date: TransactionInterface['created_date'];

  // @IsNumber()
  // balance_of: TransactionInterface['balance_of'];

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsNumber()
  event_id: number;

  @IsNumber()
  category_id: number;

  @IsEnum(CategoryType)
  category_type: TransactionInterface['category']['type'];

  @IsNumber()
  wallet_id: number;
}
