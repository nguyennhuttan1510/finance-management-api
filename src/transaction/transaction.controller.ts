import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { FindTransactionDto } from './dto/find-transaction.dto';
import {
  ResponsePattern,
  TransformFallbackInterceptor,
} from '../interceptor/transform.interceptor';
import { CategoryService } from '../category/category.service';

@UseInterceptors(TransformFallbackInterceptor)
@Controller({
  path: 'transaction',
  version: '1',
})
export class TransactionController {
  constructor(
    private readonly transactionService: TransactionService,
    private readonly categoryService: CategoryService,
  ) {}

  @Post()
  async create(@Body() createTransactionDto: CreateTransactionDto) {
    if (createTransactionDto.amount === 0)
      throw new BadRequestException('amount transaction not equal 0');
    const transactionCreated = await this.transactionService.create(
      createTransactionDto,
    );
    return new ResponsePattern(
      transactionCreated,
      true,
      'create transaction successful',
    );
  }

  @Get()
  async findAll(
    @Query()
    query: FindTransactionDto,
  ) {
    const { group_by = 'transaction' } = query;
    const transactions = await this.transactionService.findAll(query);
    switch (group_by) {
      case 'transaction':
        return new ResponsePattern(
          transactions,
          true,
          'get transactions successful',
        );
      case 'category':
        const categories = await this.categoryService.findAll();
        const transactionRes = new TransactionService(
          null,
          null,
          null,
        ).responseGroupCategory(transactions, categories);
        return new ResponsePattern(
          transactionRes,
          true,
          'get transaction successful by category',
        );
      case 'day':
        const transactionGroupDate = new TransactionService(
          null,
          null,
          null,
        ).responseGroupDate(transactions);
        return new ResponsePattern(
          transactionGroupDate,
          true,
          'get transaction successful by date',
        );
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transactionService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTransactionDto: UpdateTransactionDto,
  ) {
    return this.transactionService.update(+id, updateTransactionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.transactionService.remove(+id);
  }
}
