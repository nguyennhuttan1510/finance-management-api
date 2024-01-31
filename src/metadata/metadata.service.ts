import { Injectable } from '@nestjs/common';
import { EventService } from '../event/event.service';
import { WalletService } from '../wallet/wallet.service';
import { Event } from '../entities/event.entity';
import { Wallet } from '../entities/wallet.entity';
import { Category } from '../entities/category.entity';
import { CategoryService } from '../category/category.service';
import { MetadataEntity } from '../entities/metadata.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMetadataDto } from './dto/create-metadatum.dto';

type MetadataTransactionCreateType = {
  categories: Category[];
  wallets: Wallet[];
  events: Event[];
};

@Injectable()
export class MetadataService {
  constructor(
    private readonly categoryService: CategoryService,
    private readonly eventService: EventService,
    private readonly walletService: WalletService,
    @InjectRepository(MetadataEntity)
    private metadataRepository: Repository<MetadataEntity>,
  ) {}
  async transactionCreate(): Promise<MetadataTransactionCreateType> {
    const categories = await this.categories();
    const events = await this.events();
    const wallets = await this.wallets();
    return {
      ...categories,
      ...events,
      ...wallets,
    };
  }

  async wallets(): Promise<{ wallets: Wallet[] }> {
    const wallets = await this.walletService.findWalletForMetadata();
    return {
      wallets: wallets,
    };
  }

  async events(): Promise<{ events: Event[] }> {
    const events = await this.eventService.findAll();
    return {
      events: events,
    };
  }

  async categories(): Promise<{ categories: Category[] }> {
    const categories = await this.categoryService.findAllCategoryForMetaData();
    return {
      categories: categories,
    };
  }

  async metadataType(type: string): Promise<{ [x: string]: MetadataEntity[] }> {
    const metadata = await this.metadataRepository.find({
      where: {
        type: type.toUpperCase(),
      },
      order: {
        priority: {
          direction: 'asc',
        },
      },
    });
    return {
      [type]: metadata,
    };
  }

  async create(createMetadataDto: CreateMetadataDto) {
    return await this.metadataRepository.save({
      name: createMetadataDto.name,
      value: createMetadataDto.value,
      priority: createMetadataDto.priority,
      type: createMetadataDto.type,
      description: createMetadataDto.description,
    });
  }
}
