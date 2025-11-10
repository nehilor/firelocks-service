import { Module } from '@nestjs/common';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { FireblocksClient } from './fireblocks.client';
import { AppConfigModule } from '../config/config.module';

@Module({
  imports: [AppConfigModule],
  controllers: [TransactionsController],
  providers: [TransactionsService, FireblocksClient],
})
export class TransactionsModule {}
