import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Expose } from 'class-transformer';

@Entity('METADATA')
export class MetadataEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  name: string;

  @Column({ type: 'text' })
  value: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'text' })
  type: string;

  @Column({ type: 'int', nullable: true })
  priority: number;

  @Expose({ name: 'createdDate' })
  @CreateDateColumn()
  created_date: Date;

  @Expose({ name: 'updatedDate' })
  @UpdateDateColumn()
  updated_date: Date;
}
