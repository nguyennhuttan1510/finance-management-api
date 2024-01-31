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
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { FindCategoryDto } from './dto/find-category.dto';
import {
  ResponsePattern,
  TransformFallbackInterceptor,
} from '../interceptor/transform.interceptor';

@UseInterceptors(TransformFallbackInterceptor)
@Controller({
  path: 'category',
  version: '1',
})
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    const category = await this.categoryService.create(createCategoryDto);
    return new ResponsePattern(category, true, 'create category successful');
  }

  @Get()
  findAll(@Query() query: FindCategoryDto) {
    return this.categoryService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(+id, updateCategoryDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const categoryDelete = await this.categoryService.remove(+id);
    return new ResponsePattern(
      categoryDelete,
      true,
      `category ${id} was deleted`,
    );
  }
}
