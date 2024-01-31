import {
  CategoryInterface,
  CategoryType,
} from '../../interface/category.interface';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class CreateCategoryDto implements Partial<CategoryInterface> {
  @IsString()
  @Length(0, 20)
  name: CategoryInterface['name'];

  @IsString()
  @IsOptional()
  description?: CategoryInterface['description'];

  @IsNumber()
  @IsOptional()
  parent_id: CategoryInterface['parent_id'];

  @IsString()
  icon: CategoryInterface['icon'];

  @IsEnum(CategoryType)
  type: CategoryType;
}
