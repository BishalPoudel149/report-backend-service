import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { time } from 'console';
import { TestDto } from './dto/test.dto';
import { DatabaseService } from './services/database.service';
import { EndpointService } from './services/endpoint.service';

@Controller()
export class AppController {
  getHello(): any {
    throw new Error('Method not implemented.');
  }
  constructor(private readonly appService: AppService,
    private readonly databaseService: DatabaseService,
    private readonly endpointService:EndpointService,
  ) {}

  days=1;

  @Get()
  @Get()
  getEndpoints(): Record<string, string> {
    // List all available endpoints and their descriptions
    return this.endpointService.getEndpoints();
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
