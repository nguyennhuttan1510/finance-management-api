import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ClassSerializerInterceptor,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { WalletService } from './wallet.service';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { FindWalletDto } from './dto/find-wallet.dto';

@Controller({
  path: 'wallet',
  version: '1',
})
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Post()
  async create(@Body() createWalletDto: CreateWalletDto) {
    return await this.walletService.createWallet(createWalletDto);
  }

  @Get()
  async findAll(
    @Query()
    query: FindWalletDto,
  ) {
    return await this.walletService.findAllWallet(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.walletService.findOneWallet(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWalletDto: UpdateWalletDto) {
    return this.walletService.updateWallet(+id, updateWalletDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.walletService.removeWallet(+id);
  }
}
