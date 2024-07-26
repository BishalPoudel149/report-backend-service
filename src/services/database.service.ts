import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
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
    schema: 'DBADMIN',
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

async getLocation(category: string): Promise<string[]> {
  try {
    console.log(category);
    // Step 1: Fetch product IDs based on the category from Productmasterdata
    const productIdsQuery = `
      SELECT productId FROM PRODUCTMASTERDATA WHERE category = ?`;
    const productIds = await this.executeQuery(productIdsQuery, [category]);

    if (productIds.length === 0) {
      this.logger.warn(`No products found for category: ${category}`);
      return [];
    }
    const productIdList = productIds.map((row: any) => row.PRODUCTID).join("','");
    console.log(`productIdList:${productIdList}`);

    // Step 2: Fetch locations from Sales table based on the product IDs
    const locationsQuery = `
      SELECT DISTINCT Location FROM SALES WHERE productId IN ('${productIdList}')`;
    const locations = await this.executeQuery(locationsQuery);

    console.log(locations);

    return locations;
    //return locations.map((row: any) => row.Location);
  } catch (error) {
    this.logger.error('Failed to fetch locations', error);
    throw new Error('Failed to fetch locations');
  }
}

private async executeQuery(query: string, params: any[] = []): Promise<any[]> {
  console.log(`query:${query}`);
  return new Promise((resolve, reject) => {
    this.client.prepare(query, (err: any, statement: any) => {
      if (err) {
        this.logger.error('Failed to prepare statement', err);
        return reject(err);
      }

      statement.exec(params, (err: any, rows: any[]) => {
        if (err) {
          this.logger.error('Failed to execute query', err);
          return reject(err);
        }

        resolve(rows);
      });
    });

  });
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