import { Injectable } from "@nestjs/common";
import { Product } from "src/interfaces/product.interface";

@Injectable()
export class ProductService{
     products: Product[] = [
        { id: '12',category:'Energy Drink', storeLocation: [{"city":"Los Angeles","code":"US-CA-803"},{"city":"New York","code":"US-NY-501"}] },
        // other products
      ];
      
    // make the server call to find out the location of the particular product 

    getProductDetail(productId:string):Product{
           const product = this.products.find(product=>product.id==productId);
           return product ;
       }
       
}