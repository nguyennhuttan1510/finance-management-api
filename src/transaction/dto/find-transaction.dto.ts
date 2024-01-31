import { TransactionInterface } from '../../interface/transaction.interface';
import { IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { Transaction } from '../../entities/transaction.entity';
import { Category } from '../../entities/category.entity';

export class FindTransactionDto
  implements Partial<Omit<TransactionInterface, 'wallet' | 'category'>>
{
  @IsOptional()
  @IsDateString()
  created_date: TransactionInterface['created_date'];

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  transaction_id: TransactionInterface['transaction_id'];

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  category_id: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  amount: TransactionInterface['amount'];

  @IsNumber()
  @Type(() => Number)
  wallet_id: number;

  @IsOptional()
  @IsString()
  group_by: 'category' | 'transaction' | 'day';

  @IsOptional()
  @IsDateString()
  start_date: string;

  @IsOptional()
  @IsDateString()
  end_date: string;
}
