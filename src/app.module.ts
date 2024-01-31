import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WalletModule } from './wallet/wallet.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Configuration } from './config/configuration';
import { ConfigModule } from '@nestjs/config';
import { CategoryModule } from './category/category.module';
import { TransactionModule } from './transaction/transaction.module';
import { EventModule } from './event/event.module';
import { MetadataModule } from './metadata/metadata.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(new Configuration().getOptionDatabase()),
    WalletModule,
    CategoryModule,
    TransactionModule,
    EventModule,
    MetadataModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
