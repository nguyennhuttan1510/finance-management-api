import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { User } from '../../entities/user.entity';
import { WalletInterface } from '../../interface/wallet.interface';

export enum StatusWallet {
  'CLOSED' = 1,
  'PROCESS',
}

export enum TypeWallet {
  'TRADING' = 1,
  'SAVING',
  'BUDGET',
}

export class CreateWalletDto implements Partial<WalletInterface> {
  @IsString()
  @Length(5, 30)
  name: WalletInterface['name'];

  @IsNumber()
  balance: WalletInterface['balance'];

  @IsEnum(StatusWallet)
  status: WalletInterface['status'];

  @IsBoolean()
  is_include_total: WalletInterface['is_include_total'];

  @IsOptional()
  @IsString()
  @Length(0, 100)
  description: WalletInterface['description'];

  @IsEnum(TypeWallet)
  type: WalletInterface['type'];

  @IsArray()
  @ValidateNested({ each: true })
  // @ArrayMinSize(1)
  @Type(() => User)
  members: WalletInterface['members'];

  @IsDateString()
  @IsOptional()
  created_date: WalletInterface['created_date'];
}
