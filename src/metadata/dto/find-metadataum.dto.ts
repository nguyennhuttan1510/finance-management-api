import { MetadataQueryType } from '../../interface/metadataQueryType';
import { IsNumber, IsOptional, IsString, ValidateIf } from 'class-validator';

export class FindMetadataDto implements MetadataQueryType {
  @ValidateIf((o) => o.group == undefined)
  @IsString()
  type: MetadataQueryType['type'];

  @ValidateIf((o) => o.type == undefined)
  @IsString()
  group: MetadataQueryType['group'];
}
