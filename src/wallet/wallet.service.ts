import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateWalletDto, StatusWallet } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { Wallet } from '../entities/wallet.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { FindWalletDto } from './dto/find-wallet.dto';
import { WalletInterface } from '../interface/wallet.interface';
import {
  CategoryInterface,
  CategoryType,
} from '../interface/category.interface';
import { Transaction } from '../entities/transaction.entity';
import { CreateTransactionDto } from '../transaction/dto/create-transaction.dto';
import { CategoryService } from '../category/category.service';
import * as moment from 'moment';
import { TransactionInterface } from '../interface/transaction.interface';
import { Moment } from 'moment';
import { FindTransactionDto } from '../transaction/dto/find-transaction.dto';
import Utils from '../Utils';

export type OverviewWalletsType = {
  totalBalance: number;
  totalBalanceInclude: number;
  totalBalanceExclude: number;
  walletsInclude: WalletInterface[];
  walletsExclude: WalletInterface[];
};

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet) private repositoryWallet: Repository<Wallet>,
    private readonly categoryService: CategoryService,
  ) {}
  async createWallet(createWalletDto: CreateWalletDto) {
    const { status = StatusWallet.PROCESS, created_date = moment().toDate() } =
      createWalletDto;
    try {
      const wallet = new Wallet();
      wallet.name = createWalletDto.name;
      wallet.balance = createWalletDto.balance;
      wallet.is_include_total = createWalletDto.is_include_total;
      wallet.created_date = created_date;
      wallet.description = createWalletDto.description;
      wallet.status = status;
      wallet.type = createWalletDto.type;
      wallet.members = createWalletDto.members;
      wallet.start_date = createWalletDto.start_date;
      wallet.end_date = createWalletDto.end_date;
      wallet.target = createWalletDto.target;

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

  async overviewWallets(): Promise<OverviewWalletsType> {
    const wallets = await this.findAllWallet();
    let totalBalance = 0;
    let totalBalanceInclude = 0;
    let totalBalanceExclude = 0;
    let walletsInclude = [];
    let walletsExclude = [];
    wallets.forEach((wallet) => {
      if (wallet.is_include_total) {
        totalBalanceInclude += wallet.balance;
        walletsInclude = [...walletsInclude, wallet];
      } else {
        totalBalanceExclude += wallet.balance;
        walletsExclude = [...walletsExclude, wallet];
      }
      if (wallet.type) totalBalance += wallet.balance;
    });
    return {
      totalBalance,
      totalBalanceInclude,
      totalBalanceExclude,
      walletsInclude,
      walletsExclude,
    };
  }

  async findWalletForMetadata() {
    try {
      return await this.repositoryWallet.find({
        order: {
          wallet_id: {
            direction: 'asc',
          },
        },
      });
    } catch (e) {
      throw new NotFoundException('not found wallets for metadata');
    }
  }

  async findOne(id: number) {
    try {
      return await this.repositoryWallet.findOne({
        where: {
          wallet_id: id,
        },
      });
    } catch (e) {
      throw new NotFoundException('not found wallet');
    }
  }

  async findOneWalletRelativeTransaction(id: number) {
    try {
      return await this.repositoryWallet.findOne({
        where: {
          wallet_id: id,
        },
        relations: {
          transactions: {
            category: true,
          },
        },
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
      wallet.description = updateWalletDto.description;
      wallet.status = updateWalletDto.status;
      wallet.type = updateWalletDto.type;
      wallet.members = updateWalletDto.members;

      return await this.repositoryWallet.update(id, wallet);
    } catch (e) {
      throw new BadRequestException('update wallet failed');
    }
  }

  async updateBalanceWallet(
    id: number,
    transactionCreate: CreateTransactionDto,
  ) {
    const walletCurrent = await this.repositoryWallet.findOne({
      select: ['balance'],
      where: {
        wallet_id: id,
      },
    });
    const wallet = new Wallet();
    wallet.balance = await this.calculateBalanceOf(
      transactionCreate,
      walletCurrent.balance,
    );

    return {
      result: await this.repositoryWallet.update(id, wallet),
      balance: wallet.balance,
    };
  }

  async removeWallet(id: number) {
    try {
      return await this.repositoryWallet.delete(id);
    } catch (e) {
      throw new BadRequestException('delete wallet failed');
    }
  }

  private async calculateBalanceOf(
    transactionCreate?: CreateTransactionDto,
    amountCurrent?: number,
  ) {
    if (!amountCurrent && !transactionCreate)
      throw new BadRequestException('fail in process calculate');
    // const category = await this.categoryService.findOne(
    //   transactionCreate.category_id,
    // );
    const amountTransaction = Utils.Transaction.calculatorAmountTransaction(
      transactionCreate.amount,
      transactionCreate.category_type,
    );
    return amountCurrent + amountTransaction;
  }

  async walletSaving(wallet: Wallet) {
    const startDate = moment(wallet.start_date);
    const endDate = moment(wallet.end_date);
    const processDay = startDate.diff(endDate, 'days');
    const targetDay =
      endDate.diff(moment(), 'days') < 0
        ? processDay
        : startDate.diff(moment(), 'days');
    const remainingDay =
      endDate.diff(moment(), 'days') < 0 ? 0 : endDate.diff(moment(), 'days');
    const percentCurrent =
      wallet.balance >= wallet.target
        ? 100
        : (wallet.balance / wallet.target) * 100;
    return {
      remaining: Math.abs(remainingDay),
      percentCurrent: percentCurrent,
      percentTarget: (targetDay / processDay) * 100,
      remainingAmount:
        wallet.target - wallet.balance < 0 ? 0 : wallet.target - wallet.balance,
    };
  }
}
