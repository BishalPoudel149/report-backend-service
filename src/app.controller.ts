import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { time } from 'console';
import { TestDto } from './dto/test.dto';
import { DatabaseService } from './services/database.service';

@Controller('trend')
export class AppController {
  constructor(private readonly appService: AppService,
    private readonly databaseService: DatabaseService,
  ) {}

  days=1;

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/:productCategory')
  getTrend(@Param('productCategory') productCategory?:string,@Param('timerange') timeRange?:string){
    if(!productCategory)
    productCategory='Beverages';
     return  this.appService.getTrend(productCategory);
  }

  @Post('/createtest')
  createTest(@Body() testDto:TestDto){
    return this.databaseService.createTest(testDto);
  }
  
  
}
