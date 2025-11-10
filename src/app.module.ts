import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TransactionsModule } from './transactions/transactions.module';
import { AppConfigModule } from './config/config.module';

@Module({
  imports: [AppConfigModule, TransactionsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
