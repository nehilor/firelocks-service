import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { FireblocksTransactionResponse } from './interfaces/fireblocks-transaction.interface';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  )
  async createTransaction(
    @Body() createTransactionDto: CreateTransactionDto,
  ): Promise<FireblocksTransactionResponse> {
    return this.transactionsService.createTransaction(createTransactionDto);
  }
}
