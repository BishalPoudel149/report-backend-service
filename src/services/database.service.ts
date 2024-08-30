import { Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { GoogleTrendDto } from "src/dto/googletrend.dto";
import { TestDto } from "src/dto/test.dto";
const hana = require('@sap/hana-client');

@Injectable()
export class DatabaseService {
 
  private readonly logger = new Logger(DatabaseService.name);
  private client: any;

  constructor(){
  const connParams = {
    serverNode: '353f3d0a-ae91-4f8f-a757-99ce5e43fe6b.hana.trial-us10.hanacloud.ondemand.com:443',
    uid: 'DBADMIN',
    pwd: 'innvent24db@Pass',
  };

  this.client = hana.createClient(connParams);

  this.client.connect((err: any) => {
    if (err) {
      console.log('Connection failed', err);
    } else {
      console.log('Connected to the database');
    }
  });
}

async findUserByEmail(email: string): Promise<any> {
  return new Promise((resolve, reject) => {
    this.client.exec(
      `SELECT * FROM IFC.customer WHERE email = ?`,
      [email],
      (err, result) => {
        if (err) {
          reject(err);
        } else if (result.length === 0) {
          resolve(null);
        } else {
          resolve(result[0]);
        }
      },
    );
  });
}

  async findCustomerProducts(customerID: string): Promise<any[]> {
    try {
      const query = 'SELECT CATEGORY,SUBCATEGORY,PRODUCTNAME,BRAND,UNITPRICE FROM IFC.PRODUCT WHERE CUSTOMERID = ?';
      const result = await this.client.prepare(query).execute([customerID]);
      return result; // Assuming the result is an array of products
    } catch (error) {
      throw new InternalServerErrorException('Unable to retrieve customer products. Please try again later.');
    }
  }


  async findCustomerStore(email: string,product:string) {
    try {
      const query = `SELECT * FROM IFC.GETCUSTOMERSTORES(?,?)`;
      const statement = await this.client.prepare(query);
      const result = await statement.execute([email,product]);
      return result;
    } catch (error) {
      throw new InternalServerErrorException('Unable to retrieve customer store. Please try again later.');
    }
  }
  

  async findCustomerProductStore():Promise<any>{
   try{

      // Prepare and execute the query to get raw data from the view
      const query = 'SELECT * FROM IFC.CUSTOMERPRODUCTSSTORESVIEW';
      const statement = await this.client.prepare(query);
      const rawData = await statement.execute([]);
      return rawData;

   }catch(error){
    throw new InternalServerErrorException('Unable to retrieve customer product store data. Please try again later.');
   }
  }
   
  


async getLocation(category: string): Promise<string[]> {
  try {
    // Step 1: Fetch locations from the view based on the category
    const locationsQuery = `
      SELECT LOCATIONCODE FROM ProductLocationView WHERE CATEGORY = ?
    `;
    
    console.log(`Executing query: ${locationsQuery}`);
    const locations = await this.executeQuery(locationsQuery, [category]);

    // Extracting the location names from the result set
    return locations.map((row: any) => row.LOCATIONCODE);
  } catch (error) {
    this.logger.error('Failed to fetch locations', error);
    throw new Error('Failed to fetch locations');
  }
}


private async executeQuery(query: string, params: any[] = []): Promise<any[]> {
  console.log(`query: ${query}`);
  console.log(`params: ${params}`);
  return new Promise((resolve, reject) => {
    this.client.exec(query, params, (err: any, rows: any[]) => {
      if (err) {
        this.logger.error('Failed to execute query', err);
        return reject(err);
      }
      resolve(rows);
    });
  });
}


 // Method to insert trend data
 async insertTrendData(trends: GoogleTrendDto[]): Promise<void> {
  const insertSQL = `
    INSERT INTO TrendData (location, current, previous, change, category)
    VALUES (?, ?, ?, ?, ?)
  `;

  try {
    const insertPromises = trends.map(trend => {
      return new Promise<void>((resolve, reject) => {
        this.client.prepare(insertSQL, (err: any, statement: any) => {
          if (err) {
            this.logger.error('Failed to prepare insert statement', err);
            return reject(err);
          }

          statement.exec([trend.location, trend.current, trend.previous, trend.change, trend.category], (err: any) => {
            if (err) {
              this.logger.error('Failed to insert data', err);
              return reject(err);
            }
            resolve();
          });
        });
      });
    });

    await Promise.all(insertPromises);
    this.logger.log('Trend data inserted successfully');
  } catch (err) {
    this.logger.error('Failed to insert some trend data', err);
  }
}


async callReportProcedure(
  category: string,
 
  currentDate: string = new Date().toISOString().split('T')[0], // Default to today
  previousDate: string = new Date(new Date().setDate(new Date().getDate() - 1)).toISOString().split('T')[0] // Default to one day before today
  
): Promise<any> {
  try {
    const procedureCall = `CALL REPORT_PROCEDURE(?, ?, ?)`;

    // Execute the procedure with provided parameters
    const result = await this.executeQuery(procedureCall, [category, currentDate, previousDate]);
    
    return result;
  } catch (error) {
    this.logger.error('Failed to call REPORT_PROCEDURE', error);
    throw new Error('Failed to call REPORT_PROCEDURE');
  }
}

  // Function to truncate the trendData table
  async flushTrendData(): Promise<void> {
    const query = 'TRUNCATE TABLE trendData';

    try {
      await this.executeQuery(query);
      this.logger.log('Successfully truncated trendData table');
    } catch (error) {
      this.logger.error('Failed to truncate trendData table', error);
      throw new Error('Failed to truncate trendData table');
    }
  }


    async createTest(testDto: TestDto): Promise<any> {
        const query = `INSERT INTO TEST (EMPLOYEE_ID, FIRST_NAME, LAST_NAME, BIRTH_DATE, HIRE_DATE, JOB_TITLE)
        VALUES (?, ?, ?, ?, ?, ?)`;

        const params = [
            testDto.EMPLOYEE_ID,
            testDto.FIRST_NAME,
            testDto.LAST_NAME,
            testDto.BIRTH_DATE,
            testDto.HIRE_DATE,
            testDto.JOB_TITLE
        ];

        return new Promise((resolve, reject) => {
            this.client.prepare(query, (err, statement) => {
              if (err) {
                return reject(err);
              }
              statement.exec(params, (err, result) => {
                if (err) {
                  return reject(err);
                }
                resolve(result);
              });
            });
          });
    }




}