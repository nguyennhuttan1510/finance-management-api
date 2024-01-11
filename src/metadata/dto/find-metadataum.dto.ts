import { MetadataInterface } from '../../interface/metadata.interface';
import { IsNumber, IsOptional, IsString, ValidateIf } from 'class-validator';

export class FindMetadataDto implements MetadataInterface {
  @ValidateIf((o) => o.group == undefined)
  @IsString()
  type: MetadataInterface['type'];

  @ValidateIf((o) => o.type == undefined)
  @IsString()
  group: MetadataInterface['group'];
}
