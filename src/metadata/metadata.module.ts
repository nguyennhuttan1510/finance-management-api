import { Module } from '@nestjs/common';
import { MetadataService } from './metadata.service';
import { MetadataController } from './metadata.controller';
import { EventModule } from '../event/event.module';
import { WalletModule } from '../wallet/wallet.module';
import { CategoryModule } from '../category/category.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MetadataEntity } from '../entities/metadata.entity';

@Module({
  imports: [
    EventModule,
    WalletModule,
    CategoryModule,
    TypeOrmModule.forFeature([MetadataEntity]),
  ],
  controllers: [MetadataController],
  providers: [MetadataService],
})
export class MetadataModule {}
