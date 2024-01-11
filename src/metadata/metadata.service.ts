import { Injectable } from '@nestjs/common';
import { SubCategoryService } from '../sub-category/sub-category.service';
import { EventService } from '../event/event.service';
import { WalletService } from '../wallet/wallet.service';
import { Event } from '../entities/event.entity';
import { Wallet } from '../entities/wallet.entity';
import { SubCategory } from '../entities/sub-category.entity';

type MetadataTransactionCreateType = {
  categories: SubCategory[];
  wallets: Wallet[];
  events: Event[];
};

@Injectable()
export class MetadataService {
  constructor(
    private readonly subCategoryService: SubCategoryService,
    private readonly eventService: EventService,
    private readonly walletService: WalletService,
  ) {}
  async transactionCreate(): Promise<MetadataTransactionCreateType> {
    const categories = await this.subCategories();
    const events = await this.events();
    const wallets = await this.wallets();
    return {
      ...categories,
      ...events,
      ...wallets,
    };
  }

  async wallets(): Promise<{ wallets: Wallet[] }> {
    const wallets = await this.walletService.findAllWallet();
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

  async subCategories(): Promise<{ categories: SubCategory[] }> {
    const categories = await this.subCategoryService.findAll();
    return {
      categories: categories,
    };
  }
}
