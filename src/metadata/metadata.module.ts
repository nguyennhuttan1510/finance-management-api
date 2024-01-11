import { Module } from '@nestjs/common';
import { MetadataService } from './metadata.service';
import { MetadataController } from './metadata.controller';
import { SubCategoryModule } from '../sub-category/sub-category.module';
import { EventModule } from '../event/event.module';
import { WalletModule } from '../wallet/wallet.module';

@Module({
  imports: [SubCategoryModule, EventModule, WalletModule],
  controllers: [MetadataController],
  providers: [MetadataService],
})
export class MetadataModule {}
