import { IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';
import { TransactionInterface } from '../../interface/transaction.interface';

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

  @IsNumber()
  wallet_id: number;
}
