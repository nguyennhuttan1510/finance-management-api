import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSubCategoryDto } from './dto/create-sub-category.dto';
import { UpdateSubCategoryDto } from './dto/update-sub-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { SubCategory } from '../entities/sub-category.entity';
import { Repository } from 'typeorm';
import { FindCategoryDto } from '../category/dto/find-category.dto';
import { FindSubCategoryDto } from './dto/find-sub-category.dto';

@Injectable()
export class SubCategoryService {
  constructor(
    @InjectRepository(SubCategory)
    private repositorySubCategory: Repository<SubCategory>,
  ) {}
  async create(createSubCategoryDto: CreateSubCategoryDto) {
    try {
      const subCategory = new SubCategory();
      subCategory.name = createSubCategoryDto.name;
      subCategory.type = createSubCategoryDto.type;
      subCategory.icon = createSubCategoryDto.icon;
      subCategory.category = createSubCategoryDto.category;
      return await this.repositorySubCategory.save(subCategory);
    } catch (e) {
      throw new BadRequestException('create sub-category failed');
    }
  }

  async findAll(query?: FindSubCategoryDto) {
    try {
      return await this.repositorySubCategory.find({
        where: {
          name: query?.name,
          type: query?.type,
          category_id: query?.category_id,
        },
      });
    } catch (e) {
      throw new NotFoundException('sub-categories not found');
    }
  }

  async findAllRelativeTransaction(query?: FindSubCategoryDto) {
    try {
      return await this.repositorySubCategory.find({
        where: {
          name: query?.name,
          type: query?.type,
          category_id: query?.category_id,
        },
        relations: {
          transactions: true,
        },
      });
    } catch (e) {
      throw new NotFoundException(
        'sub-categories relative transaction not found',
      );
    }
  }

  async findOne(id: number) {
    try {
      return await this.repositorySubCategory.findOneBy({
        category_id: id,
      });
    } catch (e) {
      throw new NotFoundException('sub-category not found');
    }
  }

  async update(id: number, updateSubCategoryDto: UpdateSubCategoryDto) {
    try {
      const subCategory = new SubCategory();
      subCategory.name = updateSubCategoryDto.name;
      subCategory.type = updateSubCategoryDto.type;
      subCategory.icon = updateSubCategoryDto.icon;
      subCategory.category = updateSubCategoryDto.category;
      return await this.repositorySubCategory.update(id, subCategory);
    } catch (e) {
      throw new BadRequestException('updating sub-category failed');
    }
  }

  async remove(id: number) {
    try {
      return await this.repositorySubCategory.delete(id);
    } catch (e) {
      throw new BadRequestException('delete sub-category failed');
    }
  }
}
