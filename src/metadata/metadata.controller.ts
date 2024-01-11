import {
  BadRequestException,
  Controller,
  Get,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { MetadataService } from './metadata.service';
import { TransformInterceptor } from '../interceptor/transform.interceptor';
import { FindMetadataDto } from './dto/find-metadataum.dto';

@UseInterceptors(TransformInterceptor)
@Controller({
  path: 'metadata',
  version: '1',
})
export class MetadataController {
  constructor(private readonly metadataService: MetadataService) {}

  @Get()
  async getMetadata(@Query() query: FindMetadataDto) {
    if (query.group && query.type)
      throw new BadRequestException(
        'Please specify type or group, not both of them at the same time',
      );
    if (query.group) {
      switch (query.group) {
        case 'transaction-create': {
          return await this.metadataService.transactionCreate();
        }
        default: {
          throw new BadRequestException(
            `not found metadata by group ${query.group}`,
          );
        }
      }
    } else {
      switch (query.type) {
        case 'sub-category': {
          return await this.metadataService.subCategories();
        }
        default: {
          throw new BadRequestException(
            `not found metadata by type ${query.type}`,
          );
        }
      }
    }
  }
}
