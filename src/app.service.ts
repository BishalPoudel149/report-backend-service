import { Injectable } from '@nestjs/common';
import { ProductService } from './services/product.service';
import { googleTrendService } from './services/googletrend.service';
import { DatabaseService } from './services/database.service';

@Injectable()
export class AppService {

  constructor(private readonly productService: ProductService,
     private readonly googleTrendService :googleTrendService,
     private readonly databaseService: DatabaseService,
    
    ) {}


  locations:any;
  category:string;


  getHello(): string {
    return 'Hello World!';
  }

  // call the google trend api to fetch the data
  //Fetching data for single location or multiple location ? 
  getTrend(productCategory:string,days:number){
       //Now on call the Service which will internally call the google trend api
       this.locations= this.databaseService.getLocation(productCategory);
       
       return this.locations;

       //return this.googleTrendService.getTrends(productCategory,this.locations,days);
  }

}
