import { MetadataInterface } from '../../interface/metadataQueryType';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateMetadataDto implements Partial<MetadataInterface> {
  @IsString()
  name: string;

  @IsString()
  value: string;

  @IsString()
  description: string;

  @IsString()
  type: string;

  @IsOptional()
  @IsNumber()
  priority: number;
}
