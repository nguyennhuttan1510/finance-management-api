import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ValidationPipe,
  UseInterceptors,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { FindTransactionDto } from './dto/find-transaction.dto';
import {
  ResponsePattern,
  TransformFallbackInterceptor,
} from '../interceptor/transform.interceptor';
import { SubCategoryService } from '../sub-category/sub-category.service';

@UseInterceptors(TransformFallbackInterceptor)
@Controller({
  path: 'transaction',
  version: '1',
})
export class TransactionController {
  constructor(
    private readonly transactionService: TransactionService,
    private readonly subCategoryService: SubCategoryService,
  ) {}

  @Post()
  async create(@Body() createTransactionDto: CreateTransactionDto) {
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
    switch (group_by) {
      case 'category':
        const transactionGroupByCategory =
          await this.subCategoryService.findAllRelativeTransaction();
        return new ResponsePattern(
          transactionGroupByCategory,
          true,
          'get transaction successful by category',
        );
      case 'transaction':
        const transactions = await this.transactionService.findAll(query);
        return new ResponsePattern(
          transactions,
          true,
          'get transaction successful',
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
