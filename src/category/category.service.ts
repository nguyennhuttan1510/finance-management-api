import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from '../entities/category.entity';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { FindCategoryDto } from './dto/find-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private repositoryCategory: Repository<Category>,
  ) {}
  async create(createCategoryDto: CreateCategoryDto) {
    // CHECK ONLY NESTED ONE TIME
    const categoryParent = await this.findOne(createCategoryDto.parent_id);
    const isInValid = Boolean(categoryParent.parent_id);
    if (isInValid) {
      throw new BadRequestException(
        `category ${createCategoryDto.parent_id} is subcategory, please select parent category not is subcategory`,
      );
    }
    try {
      const category = new Category();
      category.name = createCategoryDto.name;
      category.parent_id = createCategoryDto.parent_id;
      category.type = createCategoryDto.type;
      category.description = createCategoryDto.description;
      category.icon = createCategoryDto.icon;
      return await this.repositoryCategory.save(category);
    } catch (e) {
      throw new BadRequestException('create category failed');
    }
  }

  async findAll(query?: FindCategoryDto) {
    try {
      return await this.repositoryCategory.find({
        where: {
          name: query?.name,
          type: query?.type,
          category_id: query?.category_id,
        },
      });
    } catch (e) {
      throw new NotFoundException('not found categories');
    }
  }

  async findAllCategoryForMetaData() {
    try {
      return await this.repositoryCategory.find({
        relations: {
          transactions: false,
        },
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
