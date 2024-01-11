import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CategoryInterface } from '../interface/category.interface';
import { SubCategory } from './sub-category.entity';
import { Expose } from 'class-transformer';

@Entity('CATEGORY')
export class Category implements CategoryInterface {
  @Expose({
    name: 'categoryID',
  })
  @PrimaryGeneratedColumn()
  category_id: CategoryInterface['category_id'];

  @Column('text')
  name: CategoryInterface['name'];

  @Column('text')
  icon: CategoryInterface['icon'];

  @Column({ type: 'integer' })
  type: CategoryInterface['type'];

  @Expose({
    name: 'createDate',
  })
  @CreateDateColumn()
  created_date: CategoryInterface['created_date'];

  @OneToMany(() => SubCategory, (subCategory) => subCategory.category)
  categories: SubCategory[];
}
