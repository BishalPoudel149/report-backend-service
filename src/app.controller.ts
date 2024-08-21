import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { time } from 'console';
import { TestDto } from './dto/test.dto';
import { DatabaseService } from './services/database.service';

@Controller()
export class AppController {
  getHello(): any {
    throw new Error('Method not implemented.');
  }
  constructor(private readonly appService: AppService,
    private readonly databaseService: DatabaseService,
  ) {}

  days=1;

  @Get()
  getEndpoints(): Record<string, string> {
    // List all available endpoints and their descriptions
    return {
      '/': 'Returns a list of all available endpoints',
      '/user/login' : 'POST  to Login user ',

      '/customer/:customeremail':'Get ,Fetch all the products information for particular Customer'
      
    };
  }

  @Get('trend/:productCategory')
  getTrend(@Param('productCategory') productCategory?:string,@Param('timerange') timeRange?:string){
    if(!productCategory)
    productCategory='Beverages';
     return  this.appService.getTrend(productCategory);
  }

  @Post('trend/createtest')
  createTest(@Body() testDto:TestDto){
    return this.databaseService.createTest(testDto);
  }
  
  
}
