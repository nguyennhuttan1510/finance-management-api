import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from '../entities/transaction.entity';
import { Repository } from 'typeorm';
import { FindTransactionDto } from './dto/find-transaction.dto';
import { TransactionInterface } from '../interface/transaction.interface';
import { SubCategory } from '../entities/sub-category.entity';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private repositoryTransaction: Repository<Transaction>,
  ) {}

  async create(createTransactionDto: CreateTransactionDto) {
    try {
      const transaction = new Transaction();
      transaction.amount = createTransactionDto.amount;
      // transaction.balance_of = createTransactionDto.balance_of;
      transaction.description = createTransactionDto.description;
      transaction.category = createTransactionDto.category_id;
      transaction.wallet = createTransactionDto.wallet_id;
      transaction.event = createTransactionDto.event_id;
      return await this.repositoryTransaction.save(transaction);
    } catch (e) {
      console.log(e);
      throw new BadRequestException('create transaction failed');
    }
  }

  async findAll(query: FindTransactionDto) {
    try {
      return await this.repositoryTransaction.find({
        where: {
          transaction_id: query.transaction_id,
          category: {
            category_id: query.category_id,
          },
          amount: query.amount,
          created_date: query.created_date,
          wallet: {
            wallet_id: query.wallet_id,
          },
        },
        relations: {
          category: {
            category: true,
          },
        },
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
      const transaction = new Transaction();
      transaction.amount = updateTransactionDto.amount;
      // transaction.balance_of = updateTransactionDto.balance_of;
      transaction.description = updateTransactionDto.description;
      transaction.category = updateTransactionDto.category_id;
      transaction.event = updateTransactionDto.event_id;
      return await this.repositoryTransaction.save(transaction);
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
}
