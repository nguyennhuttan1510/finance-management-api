import { CreateCategoryDto } from '../../category/dto/create-category.dto';
import { IsNumber } from 'class-validator';

export class CreateSubCategoryDto extends CreateCategoryDto {
  @IsNumber()
  category: number;
}
