import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { MetadataService } from './metadata.service';
import {
  ResponsePattern,
  TransformFallbackInterceptor,
} from '../interceptor/transform.interceptor';
import { FindMetadataDto } from './dto/find-metadataum.dto';
import { CreateMetadataDto } from './dto/create-metadatum.dto';

@UseInterceptors(TransformFallbackInterceptor)
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
    let responseMetadata;
    if (query.group) {
      switch (query.group) {
        case 'transaction-create': {
          responseMetadata = await this.metadataService.transactionCreate();
          break;
        }
        default: {
          throw new BadRequestException(
            `not found metadata by group ${query.group}`,
          );
        }
      }
    } else {
      switch (query.type) {
        case 'wallet': {
          responseMetadata = await this.metadataService.wallets();
          break;
        }
        case 'categoryType':
        case 'walletType': {
          responseMetadata = await this.metadataService.metadataType(
            query.type,
          );
          break;
        }
        case 'category': {
          responseMetadata = await this.metadataService.categories();
          break;
        }
        default: {
          throw new BadRequestException(
            `not found metadata by type ${query.type}`,
          );
        }
      }
    }
    return new ResponsePattern(
      responseMetadata,
      true,
      'get metadata successful',
    );
  }

  @Post()
  async createMetadata(@Body() createMetadataDto: CreateMetadataDto) {
    const res = await this.metadataService.create(createMetadataDto);
    return new ResponsePattern(res, true, 'create metadata successful');
  }
}
