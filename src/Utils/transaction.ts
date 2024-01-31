import { CategoryType } from '../interface/category.interface';
import { CreateTransactionDto } from '../transaction/dto/create-transaction.dto';

export const calculatorAmountTransaction = (
  amount: CreateTransactionDto['amount'],
  categoryType: CategoryType,
) => {
  let amountTransaction = 0;
  switch (categoryType) {
    case CategoryType.COST:
      amountTransaction = -amount;
      break;
    case CategoryType.INCOME:
      amountTransaction = +amount;
      break;
    default:
      amountTransaction = -amount;
      break;
  }
  return amountTransaction;
};
