import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductService } from './services/product.service';
import { googleTrendService } from './services/googletrend.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { DatabaseService } from './services/database.service';

@Module({
  imports: [
    HttpModule,
    ConfigModule.forRoot({
      isGlobal:true,
        })
  ],
  controllers: [AppController],
  providers: [AppService,ProductService,googleTrendService,DatabaseService],
})
export class AppModule {}
