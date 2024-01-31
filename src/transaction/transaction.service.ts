import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from '../entities/transaction.entity';
import { FindManyOptions, Repository } from 'typeorm';
import { FindTransactionDto } from './dto/find-transaction.dto';
import { TransactionInterface } from '../interface/transaction.interface';
import { Category } from '../entities/category.entity';
import { Raw } from 'typeorm';
import * as moment from 'moment';
import { WalletService } from '../wallet/wallet.service';
import { Moment } from 'moment/moment';
import { CategoryType } from '../interface/category.interface';
import Utils from '../Utils';
import { FindOverviewWallet } from '../wallet/dto/find-wallet.dto';
import { plainToClass } from 'class-transformer';
import { CategoryService } from '../category/category.service';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private repositoryTransaction: Repository<Transaction>,
    private readonly walletService: WalletService,
    private categoryService: CategoryService,
  ) {}

  async create(createTransactionDto: CreateTransactionDto) {
    try {
      const wallet = await this.walletService.updateBalanceWallet(
        createTransactionDto.wallet_id,
        createTransactionDto,
      );
      const plainTransaction: Partial<
        Omit<Transaction, 'category'> & { category: number }
      > = {
        amount: Utils.Transaction.calculatorAmountTransaction(
          createTransactionDto.amount,
          createTransactionDto.category_type,
        ),
        description: createTransactionDto.description,
        category: createTransactionDto.category_id,
        balance_of: wallet.balance,
        wallet: createTransactionDto.wallet_id,
        event: createTransactionDto.event_id,
        created_date: createTransactionDto.created_date,
      };

      const transactionInstance = plainToClass(Transaction, plainTransaction);
      return await this.repositoryTransaction.save(transactionInstance);
    } catch (e) {
      console.log(e);
      throw new BadRequestException('create transaction failed');
    }
  }

  async findAll(
    query: Partial<FindTransactionDto> = {
      start_date: moment().toISOString(),
      end_date: moment().toISOString(),
    },
    option?: FindManyOptions<Transaction>,
  ) {
    const { transaction_id, category_id, amount, wallet_id } = query;
    try {
      return await this.repositoryTransaction.find({
        where: {
          transaction_id: transaction_id,
          category: {
            category_id: category_id,
          },
          amount: amount,
          created_date: Utils.TypeORM.QueryCondition.BetweenDates(
            query.start_date,
            query.end_date,
          ),
          wallet: {
            wallet_id: wallet_id,
          },
        },
        relations: {
          category: true,
        },
        order: {
          created_date: {
            direction: 'DESC',
          },
        },
        ...option,
      });
    } catch (e) {
      throw new NotFoundException('transactions not found');
    }
  }

  async findOne(id: TransactionInterface['transaction_id']) {
    try {
      return await this.repositoryTransaction.findOne({
        where: {
          transaction_id: id,
        },
        relations: {
          category: true,
        },
      });
    } catch (e) {
      throw new NotFoundException('transactions not found');
    }
  }

  async update(id: number, updateTransactionDto: UpdateTransactionDto) {
    try {
      const plainTransaction: Partial<
        Omit<Transaction, 'category'> & { category: number }
      > = {
        amount: Utils.Transaction.calculatorAmountTransaction(
          updateTransactionDto.amount,
          updateTransactionDto.category_type,
        ),
        description: updateTransactionDto.description,
        category: updateTransactionDto.category_id,
        event: updateTransactionDto.event_id,
      };
      const transactionInstance = plainToClass(Transaction, plainTransaction);
      return await this.repositoryTransaction.save(transactionInstance);
    } catch (e) {
      throw new BadRequestException('update transaction failed');
    }
  }

  async remove(id: TransactionInterface['transaction_id']) {
    try {
      return await this.repositoryTransaction.delete(id);
    } catch (e) {
      throw new BadRequestException('delete transaction failed');
    }
  }
  responseGroupCategory(transactions: Transaction[], categories: Category[]) {
    const uniqCategoryParent = [
      ...new Set(
        transactions.map((transaction) => {
          if (typeof transaction.category === 'number') return;
          return (transaction.category.parent_id ??=
            transaction.category.category_id);
        }),
      ),
    ];

    return uniqCategoryParent.map((categoryParentID) => {
      const categoryParent = categories.find(
        (category) => category.category_id === categoryParentID,
      );
      const transactionsByCategoryParent = transactions.filter(
        (transaction) => {
          if (typeof transaction.category !== 'number')
            return transaction.category.parent_id === categoryParentID;
        },
      );
      return {
        ...categoryParent,
        total: this.sumAmountTransaction(transactionsByCategoryParent),
        length: transactionsByCategoryParent.length,
        transactions: transactionsByCategoryParent,
      };
    });
  }

  responseGroupDate(transactions: Transaction[]) {
    const uniqDate = [
      ...new Set(
        transactions.map((transaction) => {
          return moment(transaction.created_date).format('L');
        }),
      ),
    ];

    return uniqDate.map((date) => {
      const transactionsByDate = transactions.filter((transaction) => {
        return moment(transaction.created_date).format('L') == date;
      });
      return {
        createdDate: moment(date).toISOString(),
        total: this.sumAmountTransaction(transactionsByDate),
        length: transactionsByDate.length,
        transactions: transactionsByDate,
      };
    });
  }

  private sumAmountTransaction = (transactions: Transaction[]) => {
    try {
      const initialValue = 0;
      return transactions
        .map((transaction) => transaction.amount)
        .reduce(
          (accumulator, currentValue) => accumulator + currentValue,
          initialValue,
        );
    } catch (e) {
      throw new InternalServerErrorException(
        'Sum amount transaction group by category failed!',
      );
    }
  };

  async analyzeWallet(query?: FindTransactionDto | FindOverviewWallet) {
    const {
      start_date = moment().toISOString(),
      end_date = moment().toISOString(),
    } = query;
    const general = {
      highestCost: 0,
      highestIncome: 0,
      highestOther: 0,
      lowestCost: 0,
      lowestIncome: 0,
      lowestOther: 0,
      totalIncome: 0,
      totalCost: 0,
      startAmount: 0,
      endAmount: 0,
      startDate: moment(start_date).toISOString(),
      endDate: moment(end_date).toISOString(),
      categoriesIncome: [],
      categoriesCost: [],
      daysIncome: [],
      daysCost: [],
    };

    try {
      const transactionLastInPrevMonth = await this.getTransactionInMonth(
        'start',
        query?.wallet_id,
        start_date,
        end_date,
      );
      const transactionLastInCurrentMonth = await this.getTransactionInMonth(
        'end',
        query?.wallet_id,
        start_date,
        end_date,
      );
      if (
        Array.isArray(transactionLastInPrevMonth) &&
        transactionLastInPrevMonth[0]
      ) {
        general.startAmount =
          transactionLastInPrevMonth[0]?.balance_of || general.startAmount;
      }
      if (
        Array.isArray(transactionLastInCurrentMonth) &&
        transactionLastInCurrentMonth[0]
      ) {
        general.endAmount =
          transactionLastInCurrentMonth[0]?.balance_of || general.endAmount;
      }

      const statisticIncome = await this.sumAmountBy(
        query?.wallet_id,
        CategoryType.INCOME,
        start_date,
        end_date,
      );
      const statisticCost = await this.sumAmountBy(
        query?.wallet_id,
        CategoryType.COST,
        start_date,
        end_date,
      );
      general.categoriesIncome = statisticIncome.categories;
      general.categoriesCost = statisticCost.categories;
      general.daysIncome = statisticIncome.days;
      general.daysCost = statisticCost.days;
    } catch (e) {
      console.log(e);
    }

    const transactions = await this.findAll({
      wallet_id: query?.wallet_id,
      start_date,
      end_date,
    });

    const getArrayAmountTransaction = (
      transactions: Transaction[],
    ): number[] => {
      if (!Array.isArray(transactions)) return [];
      return transactions.map((transaction) => transaction.amount);
    };

    if (Array.isArray(transactions)) {
      let transactionTypeIncome = [];
      let transactionTypeCost = [];
      let transactionTypeOther = [];
      transactions.forEach((transaction) => {
        if (typeof transaction.category == 'number') return;
        if (transaction.category.type === CategoryType.COST) {
          transactionTypeCost = [...transactionTypeCost, transaction];
        }
        if (transaction.category.type === CategoryType.INCOME) {
          transactionTypeIncome = [...transactionTypeIncome, transaction];
        }
        if (transaction.category.type === CategoryType.OTHER) {
          transactionTypeOther = [...transactionTypeOther, transaction];
        }
      });

      const arrayAmountCost = getArrayAmountTransaction(transactionTypeCost);
      const arrayAmountIncome = getArrayAmountTransaction(
        transactionTypeIncome,
      );
      const arrayAmountOther = getArrayAmountTransaction(transactionTypeOther);

      general.highestCost = Math.abs(Math.min(...arrayAmountCost));
      general.highestIncome = Math.max(...arrayAmountIncome);
      general.highestOther = Math.max(...arrayAmountOther);
      general.lowestCost = Math.abs(Math.max(...arrayAmountCost));
      general.lowestIncome = Math.min(...arrayAmountIncome);
      general.lowestOther = Math.min(...arrayAmountOther);
      general.totalIncome = arrayAmountIncome.reduce(
        (accumulator, currentValue) => accumulator + currentValue,
        general.totalIncome,
      );
      general.totalCost = Math.abs(
        arrayAmountCost.reduce(
          (accumulator, currentValue) => accumulator + currentValue,
          general.totalCost,
        ),
      );
    }
    return {
      general: general,
    };
  }

  async getTransactionInMonth(
    type: 'start' | 'end' | 'highest' | 'lowest' = 'start',
    walletID?: number,
    startDate: string | Moment = moment(),
    endDate: string | Moment = moment(),
  ): Promise<Transaction[]> {
    let queryCondition = [];
    if (walletID) {
      queryCondition = [...queryCondition, `t."walletWalletId" = ${walletID}`];
    }
    let start = startDate;
    let end = endDate;
    switch (type) {
      case 'start':
        start = moment(start).subtract(1, 'month').format('YYYY-MM-DD');
        end = moment(end).subtract(1, 'month').format('YYYY-MM-DD');
        break;
      case 'end':
        start = moment(start).format('YYYY-MM-DD');
        end = moment(end).format('YYYY-MM-DD');
        break;
    }
    queryCondition = [
      ...queryCondition,
      `t.created_date::date >= '${start}' and t.created_date::date <= '${end}'`,
    ];
    return await this.repositoryTransaction.query(
      `select * from "TRANSACTION" t where t.created_date = (
        SELECT MAX(t.created_date) AS max_date FROM "TRANSACTION" t where ${queryCondition.join(
          ' and ',
        )}
      )`,
    );
  }

  async sumAmountBy(
    walletID?: number,
    categoryType: CategoryType = CategoryType.COST,
    startDate: string | Moment = moment(),
    endDate: string | Moment = moment(),
  ): Promise<{
    categories: { category_id: number; name: string; sum: number }[];
    days: { day: number; sum: number }[];
  }> {
    let condition = [];
    if (walletID) {
      condition = [...condition, `t."walletWalletId" = ${walletID}`];
    }
    if (categoryType) {
      condition = [...condition, `c."type" = ${categoryType}`];
    }
    condition = [
      ...condition,
      `t.created_date::date >= '${moment(startDate).format(
        'YYYY-MM-DD',
      )}' and t.created_date::date <= '${moment(endDate).format(
        'YYYY-MM-DD',
      )}'`,
    ];
    const statisticsCategory = await this.repositoryTransaction.query(`
      SELECT t."category_id", c."name", c."parent_id" , SUM(t.amount) as sum 
      FROM "TRANSACTION" t 
      inner join "CATEGORY" c ON t."category_id" = c."category_id" 
      where ${condition.join(
        ' and ',
      )} group by t."category_id", c."name", c."parent_id"`);

    const statisticsDay = await this.repositoryTransaction.query(`
      select extract(day from t.created_date)as day ,  SUM(t.amount) as sum 
      FROM "TRANSACTION" t
      inner join "CATEGORY" c ON t."category_id" = c."category_id" 
      where ${condition.join(
        ' and ',
      )} group by extract(day from t.created_date)`);

    const convertStatisticDay = (
      statisticsDay: { day: number; sum: number }[],
    ) => {
      const days = Array.from(
        { length: moment().daysInMonth() },
        (v, i) => i + 1,
      );
      return days.map(
        (day) =>
          statisticsDay.find((item) => +item.day === +day) ?? {
            day: day,
            sum: 0,
          },
      );
    };

    return {
      categories: await this.calculateTotalAmountOfParentCategory(
        statisticsCategory,
      ),
      days: convertStatisticDay(statisticsDay),
    };
  }

  percentAmountTransaction = (
    transactions: Transaction[],
    total: number,
  ): (Transaction & { percent: number })[] => {
    if (!Array.isArray(transactions) || transactions.length === 0 || !total)
      return [];

    return transactions.map((transaction) => ({
      ...transaction,
      percent:
        typeof transaction.amount === 'number' && typeof total === 'number'
          ? Math.round((Math.abs(transaction.amount) / total) * 100)
          : 0,
    }));
  };

  calculateTotalAmountOfParentCategory = async (
    categoriesGroupById: {
      category_id: number;
      name: string;
      sum: number;
      parent_id: number;
    }[],
  ): Promise<
    {
      category_id: number;
      name: string;
      sum: number;
      parent_id: number;
    }[]
  > => {
    let result = [];
    const categories = await this.categoryService.findAll();
    const categoriesParent = categories.filter(
      (item) => item.parent_id === null,
    );
    categoriesParent.forEach((categoryParent) => {
      let totalAmount = 0;
      categoriesGroupById.forEach((item) => {
        if (
          item.parent_id === categoryParent.category_id ||
          item.category_id === categoryParent.category_id
        ) {
          totalAmount += Number(item.sum);
        }
      });
      if (totalAmount === 0) return;
      result = [
        ...result,
        {
          ...categoryParent,
          sum: totalAmount,
        },
      ];
    });
    return result;
  };
}
