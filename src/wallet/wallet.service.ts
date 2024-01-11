import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { Wallet } from '../entities/wallet.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { FindWalletDto } from './dto/find-wallet.dto';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet) private repositoryWallet: Repository<Wallet>,
  ) {}
  async createWallet(createWalletDto: CreateWalletDto) {
    try {
      const wallet = new Wallet();
      wallet.name = createWalletDto.name;
      wallet.balance = createWalletDto.balance;
      wallet.is_include_total = createWalletDto.is_include_total;
      wallet.created_date = createWalletDto.created_date;
      wallet.description = createWalletDto.description;
      wallet.status = createWalletDto.status;
      wallet.type = createWalletDto.type;
      wallet.members = createWalletDto.members;

      console.log('wallet', wallet);
      return await this.repositoryWallet.save(wallet);
    } catch (e) {
      throw new BadRequestException('create wallet failed');
    }
  }

  async findAllWallet(query?: FindWalletDto) {
    try {
      return await this.repositoryWallet.find({
        where: {
          name: query?.name,
          type: query?.type,
          status: query?.status,
        },
      });
    } catch (e) {
      throw new NotFoundException('not found wallets');
    }
  }

  async findOneWallet(id: number) {
    try {
      return await this.repositoryWallet.findOneBy({
        wallet_id: id,
      });
    } catch (e) {
      throw new NotFoundException('not found wallet');
    }
  }

  async updateWallet(id: number, updateWalletDto: UpdateWalletDto) {
    try {
      const wallet = new Wallet();
      wallet.name = updateWalletDto.name;
      wallet.balance = updateWalletDto.balance;
      wallet.is_include_total = updateWalletDto.is_include_total;
      wallet.created_date = updateWalletDto.created_date;
      wallet.description = updateWalletDto.description;
      wallet.status = updateWalletDto.status;
      wallet.type = updateWalletDto.type;
      wallet.members = updateWalletDto.members;

      return await this.repositoryWallet.update(id, wallet);
    } catch (e) {
      throw new BadRequestException('update wallet failed');
    }
  }

  async removeWallet(id: number) {
    try {
      return await this.repositoryWallet.delete(id);
    } catch (e) {
      throw new BadRequestException('delete wallet failed');
    }
  }
}
