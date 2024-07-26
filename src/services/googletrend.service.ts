import { HttpService } from "@nestjs/axios";
import { Injectable  } from "@nestjs/common";
import * as serp from 'google-trends-api';

@Injectable()
export class googleTrendService{
    private readonly apiKey: string = 'baaab620ff52b724631301888dadbb707e433771d0db19a46da8e13413836e85'; 

    constructor(private readonly httpService: HttpService) {}

    async getTrends(category: string,  locations: any[], days: number) {
        const trendsData = await Promise.all(
          locations.map(async (location) => {
            try {
              location=`Germany, ${location}`
              const result = await serp.interestOverTime({ keyword: category, location, apiKey: this.apiKey });
              const trendChange = this.calculateTrendChange(result.default.timelineData, days);
              return { location, trendChange };
            } catch (error) {
              console.error(`Error fetching trends for ${location}:`, error);
              return { location, trendChange: null, error: error.message };
            }
          })
        );
    
        // return trendsData;
        const result = await serp.interestOverTime({ keyword: category, geo: locations[0].code, apiKey: this.apiKey });
       return result;
        
       

      }

      private calculateTrendChange(timelineData: any[], days: number): number {
        if (timelineData.length < days) {
          throw new Error('Insufficient data to calculate trend change');
        }
    
        const endIndex = timelineData.length - 1;
        const startIndex = endIndex - days;
    
        const startValue = timelineData[startIndex].value[0];
        const endValue = timelineData[endIndex].value[0];
    
        const percentageChange = ((endValue - startValue) / startValue) * 100;
    
        return percentageChange;
      }

}