import { Injectable } from '@nestjs/common';
import { DatabaseService } from './services/database.service';
import { GoogleTrendsService } from './services/googledirect.service';

@Injectable()
export class AppService {

  constructor(
     private readonly databaseService: DatabaseService,
     private readonly googleTrendsService:GoogleTrendsService
    
    ) {}


  locations:any;


  getHello(): string {
    return 'Hello World!';
  }


  async getTrend(category:string){       
  this.locations= await this.databaseService.getLocation(category);
  console.log(this.locations);

await this.getTrendsForLocations(category, this.locations);

   const mappedData = await this.databaseService.callReportProcedure(category);
   // flush the trend data

   this.databaseService.flushTrendData();

   return mappedData;
  }

  async getTrendsForLocations(category: string, locations: string[]): Promise<any> {
    try {
      const data = await this.googleTrendsService.fetchAndCalculateForLocations(category, locations).toPromise();
      //insert trend for location

      await this.databaseService.insertTrendData(data);

      return data;
    } catch (error) {
      console.error('Failed to fetch trends for locations', error);
      throw error;
    }
  }

}
