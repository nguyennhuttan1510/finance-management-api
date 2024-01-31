import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { WalletService } from './wallet.service';
import { CreateWalletDto, TypeWallet } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { FindOverviewWallet, FindWalletDto } from './dto/find-wallet.dto';
import { TransactionService } from '../transaction/transaction.service';
import { CategoryService } from '../category/category.service';
import {
  ResponsePattern,
  TransformFallbackInterceptor,
} from '../interceptor/transform.interceptor';
import { Wallet } from '../entities/wallet.entity';
import { plainToClass } from 'class-transformer';
import Utils from '../Utils';
import { CategoryType } from '../interface/category.interface';

@UseInterceptors(TransformFallbackInterceptor)
@Controller({
  path: 'wallet',
  version: '1',
})
export class WalletController {
  constructor(
    private readonly walletService: WalletService,
    private readonly categoryService: CategoryService,
    private readonly transactionService: TransactionService,
  ) {}

  @Post()
  async create(@Body() createWalletDto: CreateWalletDto) {
    const wallet = await this.walletService.createWallet(createWalletDto);
    return new ResponsePattern(wallet, true, 'create wallet successful');
  }

  @Get()
  async findAll(
    @Query()
    query: FindWalletDto,
  ) {
    const wallets = await this.walletService.findAllWallet(query);
    return new ResponsePattern(wallets, true, 'get wallets successful');
  }

  @Get('overview')
  async overviewWallets() {
    const wallets = await this.walletService.overviewWallets();
    return new ResponsePattern(wallets, true, 'get wallets successful');
  }

  @Get('dashboard')
  async overviewDashboard(@Query() query?: FindOverviewWallet) {
    const analyzeWallet = await this.transactionService.analyzeWallet(query);
    const overviewWallet = await this.walletService.overviewWallets();
    const transactionsLatest = await this.transactionService.findAll(
      undefined,
      {
        where: {
          created_date: Utils.TypeORM.QueryCondition.BetweenDates(
            query.start_date,
            query.end_date,
          ),
        },
        take: 10,
        relations: {
          category: true,
        },
      },
    );
    const transactionsHighest = await this.transactionService.findAll(
      undefined,
      {
        where: {
          created_date: Utils.TypeORM.QueryCondition.BetweenDates(
            query.start_date,
            query.end_date,
          ),
          category: {
            type: CategoryType.COST,
          },
        },
        order: {
          amount: 'ASC',
        },
        take: 5,
        relations: {
          category: true,
        },
      },
    );
    const response = {
      transaction: {
        highestTransaction: this.transactionService.percentAmountTransaction(
          transactionsHighest,
          analyzeWallet.general.totalCost,
        ),
        latestTransaction: transactionsLatest,
      },
      ...overviewWallet,
      ...analyzeWallet,
    };
    return new ResponsePattern(
      response,
      true,
      'get analyze overview wallet successful',
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Query() query: FindWalletDto) {
    const wallet = await this.walletService.findOne(+id);
    switch (Number(wallet.type)) {
      case TypeWallet.SAVING:
        const savingWallet = await this.walletService.walletSaving(wallet);
        const walletResponse = plainToClass(
          Wallet,
          { ...savingWallet, ...wallet },
          {
            exposeDefaultValues: true,
          },
        );
        return new ResponsePattern(
          walletResponse,
          true,
          'get saving wallet successful',
        );
      case TypeWallet.TRADING:
        return new ResponsePattern(wallet, true, 'get wallet successful');
    }
  }

  @Get(':id/analyze')
  async analyzeWallet(@Param('id') id: string, @Query() query) {
    const wallet = await this.walletService.findOne(+id);
    const analyzeWallet = await this.transactionService.analyzeWallet({
      ...query,
      wallet_id: +id,
    });
    wallet.general = analyzeWallet.general;
    return new ResponsePattern(wallet, true, 'get analyze wallet successful');
  }
  @Get(':id/detail')
  async walletDetail(@Param('id') id: string, @Query() query: FindWalletDto) {
    const wallet = await this.walletService.findOneWalletRelativeTransaction(
      +id,
    );
    const categories = await this.categoryService.findAll();
    let transactions = [];
    switch (query.group_by) {
      case 'transaction':
        transactions = new TransactionService(null, null, null).responseGroupCategory(
          wallet.transactions,
          categories,
        );
        break;
      case 'day':
        transactions = new TransactionService(null, null,null).responseGroupDate(
          wallet.transactions,
        );
        break;
      default:
        transactions = new TransactionService(null, null,null).responseGroupCategory(
          wallet.transactions,
          categories,
        );
        break;
    }
    wallet.transactions = transactions;
    return new ResponsePattern(wallet, true, 'get wallet successful');
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateWalletDto: UpdateWalletDto,
  ) {
    const wallet = await this.walletService.updateWallet(+id, updateWalletDto);
    return new ResponsePattern(wallet, true, `wallet ${id} updated`);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const res = await this.walletService.removeWallet(+id);
    return new ResponsePattern(res, true, `delete wallet ${id} successful`);
  }
}
