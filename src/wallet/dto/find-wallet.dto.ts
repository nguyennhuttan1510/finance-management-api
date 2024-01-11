import { IsEnum, IsOptional, IsString } from 'class-validator';
import { StatusWallet, TypeWallet } from './create-wallet.dto';
import { WalletInterface } from '../../interface/wallet.interface';

export class FindWalletDto
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
}
