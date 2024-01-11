import {
  CategoryInterface,
  CategoryType,
} from '../../interface/category.interface';
import { IsEnum, IsString, Length } from 'class-validator';

export class CreateCategoryDto implements Partial<CategoryInterface> {
  @IsString()
  @Length(0, 20)
  name: CategoryInterface['name'];

  @IsString()
  icon: CategoryInterface['icon'];

  @IsEnum(CategoryType)
  type: CategoryType;
}
