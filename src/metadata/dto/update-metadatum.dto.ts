import { PartialType } from '@nestjs/swagger';
import { CreateMetadataDto } from './create-metadatum.dto';

export class UpdateMetadatumDto extends PartialType(CreateMetadataDto) {}
