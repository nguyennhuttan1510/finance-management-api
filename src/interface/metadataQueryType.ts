import {
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Expose } from 'class-transformer';

export type TypeMetaData =
  | 'transaction'
  | 'wallet'
  | 'event'
  | 'category'
  | 'walletType'
  | 'categoryType';
export type GroupMetaData = 'transaction-create';

export type MetadataQueryType = {
  type: TypeMetaData;
  group: GroupMetaData;
};

export type MetadataInterface = {
  id: number;
  name: string;
  value: string;
  type: string;
  description: string;
  priority: number;
  created_date: Date;
  updated_date: Date;
};
