import { Injectable, NotFoundException } from "@nestjs/common";
import { DatabaseService } from "./database.service";

@Injectable()
export class CustomerDataService {
   

    constructor(private readonly dbService: DatabaseService) { }
    async customercategory(email: string) {
        try {
            const user = await this.dbService.findUserByEmail(email);

            if (!user) {
                throw new NotFoundException('User not found');
            }

            // Fetch products for the customer
            const products = await this.dbService.findCustomerProducts(user.ID);
            return products;
        } catch (error) {
            // You can handle specific errors or rethrow
            throw new Error(`Failed to fetch customer category: ${error.message}`);
        }
    }

    async customerStoreLocation(email:string,product:string){
        try{      
            const storeLocations=await this.dbService.findCustomerStore(email,product);
            return storeLocations;

        }catch(error){
            throw new Error('Failed to Fetch customer Store Locatoin: ${error.message}');
        }
    }
    async getCustomerProductsStores(): Promise<any> {
        const rawData = await this.dbService.findCustomerProductStore();
        
        const result = rawData.reduce((acc, row) => {
            // Check if the customer already exists in the accumulator
            let customer = acc.find(c => c.CustomerID === row.CUSTOMERID);
            
            if (!customer) {
                // If the customer doesn't exist, create a new entry for the customer
                customer = {
                    CustomerID: row.CUSTOMERID,
                    CustomerName: row.CUSTOMERNAME,
                    Products: []
                };
                acc.push(customer);
            }
        
            // Check if the product already exists under this customer
            let product = customer.Products.find(p => p.ProductID === row.PRODUCTID);
            
            if (!product) {
                // If the product doesn't exist, create a new entry for the product
                product = {
                    ProductID: row.PRODUCTID,
                    ProductName: row.PRODUCTNAME,
                    Stores: []
                };
                customer.Products.push(product);
            }
        
            // Check if the store already exists under this product
            let store = product.Stores.find(s => s.StoreID === row.STOREID);
            
            if (!store) {
                // If the store doesn't exist, create a new entry for the store
                store = {
                    StoreID: row.STOREID,
                    StoreName: row.STORENAME
                };
                product.Stores.push(store);
            }
        
            return acc;
        }, []);
    
        return result;
    }


}