import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { StatusWallet, TypeWallet } from './create-wallet.dto';
import { WalletInterface } from '../../interface/wallet.interface';
import { FindTransactionDto } from '../../transaction/dto/find-transaction.dto';
import { Type } from 'class-transformer';

export class FindWalletDto
  extends FindTransactionDto
  implements Pick<WalletInterface, 'name' | 'status' | 'type'>
{
  @IsString()
  @IsOptional()
  name: string;

  @IsEnum(StatusWallet)
  @IsOptional()
  status: StatusWallet;

  @IsEnum(TypeWallet)
  @IsOptional()
  type: TypeWallet;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  wallet_id: number;
}

export class FindOverviewWallet implements Partial<FindTransactionDto> {
  @IsOptional()
  @IsDateString()
  start_date: string;

  @IsOptional()
  @IsDateString()
  end_date: string;

  @IsOptional()
  @IsNumber()
  wallet_id: number;
}
