import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from '../entities/category.entity';
import { Repository } from 'typeorm';
import { FindCategoryDto } from './dto/find-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private repositoryCategory: Repository<Category>,
  ) {}
  async create(createCategoryDto: CreateCategoryDto) {
    try {
      const category = new Category();
      category.name = createCategoryDto.name;
      category.type = createCategoryDto.type;
      category.icon = createCategoryDto.icon;
      return await this.repositoryCategory.save(category);
    } catch (e) {
      throw new BadRequestException('create category failed');
    }
  }

  async findAll(query: FindCategoryDto) {
    try {
      return await this.repositoryCategory.find({
        where: {
          name: query.name,
          type: query.type,
          category_id: query.category_id,
        },
        relations: {
          categories: true,
        },
        relationLoadStrategy: 'query',
      });
    } catch (e) {
      throw new NotFoundException('not found categories');
    }
  }

  async findOne(id: number) {
    try {
      return await this.repositoryCategory.findOneBy({
        category_id: id,
      });
    } catch (e) {
      throw new NotFoundException('not found category');
    }
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    try {
      const category = new Category();
      category.name = updateCategoryDto.name;
      category.type = updateCategoryDto.type;
      category.icon = updateCategoryDto.icon;
      return await this.repositoryCategory.save(category);
    } catch (e) {
      throw new BadRequestException('update category failed');
    }
  }

  async remove(id: number) {
    try {
      return await this.repositoryCategory.delete(id);
    } catch (e) {
      throw new BadRequestException('delete category failed');
    }
  }
}
