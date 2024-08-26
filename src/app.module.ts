import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { DatabaseService } from './services/database.service';
import { GoogleTrendsService } from './services/googledirect.service';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { CustomerDataService } from './services/category.service';
import { CustomerDataController } from './controllers/categorical.controller';

@Module({
  imports: [
    HttpModule,
    ConfigModule.forRoot({
      isGlobal:true,
        })
  ],
  controllers: [AppController,UserController,CustomerDataController],
  providers: [AppService,DatabaseService,GoogleTrendsService,UserService,CustomerDataService],
})
export class AppModule {}
