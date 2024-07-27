import { Injectable, HttpException } from '@nestjs/common';
import { catchError, map } from 'rxjs/operators';
import { Observable, forkJoin, throwError } from 'rxjs';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class GoogleTrendsService {

  timeRange=1;

  private readonly apiKey = 'baaab620ff52b724631301888dadbb707e433771d0db19a46da8e13413836e85'; // Replace with your actual API key
  private readonly baseUrl = 'https://serpapi.com/search.json';

  constructor(private readonly httpService: HttpService) {}

  fetchTrends(query: string, location: string): Observable<any> {

   const timeFrame = `now ${this.timeRange}-d`; // e.g., "now 7-d" for the last 7 days // for 7+ day it will come as today 
    const url = `${this.baseUrl}?engine=google_trends&api_key=${this.apiKey}&q=${encodeURIComponent(query)}&loc=${encodeURIComponent(location)}&date=${encodeURIComponent(timeFrame)}`;
    console.log(`URL: ${url}`);

    return this.httpService.get(url).pipe(
      map(response => response.data),
      catchError(error => {
        throw new HttpException('Failed to fetch data from SerpAPI', error.response.status);
      }),
    );
  }

  fetchAndCalculateForLocations(category: string, locations: string[]): Observable<any> {
    const observables = locations.map(location => 
      this.fetchTrends(category, location).pipe(
        map(data => ({
         category,
          location,
          ...this.calculatePercentageChange(data),
        }))
      )
    );

    return forkJoin(observables);
  }


  // Extract the percentage change from the response data
  calculatePercentageChange(data: any): { current: number; previous: number; change: number } {
    if (!data || !data.interest_over_time || !data.interest_over_time.timeline_data) {
      throw new Error('Invalid data format');
    }

    const timelineData = data.interest_over_time.timeline_data;
    if (timelineData.length < 2) {
      throw new Error('Not enough data points to calculate percentage change');
    }
    

    const latest = timelineData[timelineData.length - 1].values[0].extracted_value;
    const previous = timelineData[0].values[0].extracted_value;
    
    const change = parseFloat(((latest - previous) / previous * 100).toFixed(1));

    return { current: latest, previous, change };
  }
}
