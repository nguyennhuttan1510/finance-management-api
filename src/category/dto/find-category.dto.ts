import {
  CategoryInterface,
  CategoryType,
} from '../../interface/category.interface';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export class FindCategoryDto implements Partial<CategoryInterface> {
  @IsNumber()
  @IsOptional()
  category_id: CategoryInterface['category_id'];

  @IsString()
  @IsOptional()
  name: CategoryInterface['name'];

  @IsEnum(CategoryType)
  @IsOptional()
  type: CategoryInterface['type'];
}
