import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { DatabaseService } from './services/database.service';
import { GoogleTrendsService } from './services/googledirect.service';

@Module({
  imports: [
    HttpModule,
    ConfigModule.forRoot({
      isGlobal:true,
        })
  ],
  controllers: [AppController],
  providers: [AppService,DatabaseService,GoogleTrendsService],
})
export class AppModule {}
