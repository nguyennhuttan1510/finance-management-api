import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as process from 'process';
import { Wallet } from '../entities/wallet.entity';
import { Category } from '../entities/category.entity';
import { Transaction } from '../entities/transaction.entity';
import { Event } from '../entities/event.entity';
import * as moment from 'moment-timezone';

const timezone = moment.tz.guess();
export class Configuration {
  private optionDatabase: TypeOrmModuleOptions = {
    type: process.env.TYPE_DB as 'postgres',
    host: process.env.HOST_DB,
    port: Number(process.env.PORT_DB),
    database: process.env.DATABASE_NAME,
    username: process.env.USERNAME_DB,
    password: process.env.PASSWORD_DB,
    entities: [Wallet, Category, Transaction, Event],
    autoLoadEntities: true,
    synchronize: true,
    logging: true,
  };

  // getIpNetwork() {
  //   return getEn0Ipv4().address;
  // }
  getOptionDatabase() {
    return this.optionDatabase;
  }
}
