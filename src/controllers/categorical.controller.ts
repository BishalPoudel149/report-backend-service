import { Body, Controller, Get, Param } from "@nestjs/common";
import { CustomerDataService } from "src/services/category.service";

@Controller('customer')
export class CustomerDataController{
    constructor(private readonly categoryService:CustomerDataService){}

    @Get('products/:customeremail')
    productCategory(@Param() params:any){
        console.log(params.customeremail);
        return this.categoryService.customercategory(params.customeremail);
    }

    @Get('stores/:customeremail/:product')
        storeLocations(@Param() params:any){
        console.log(params.customeremail);
        return this.categoryService.customerStoreLocation(params.customeremail,params.product);
    }

    @Get('customers-products-stores')
    async getCustomersWithProductsAndStores(): Promise<any> {
        console.log('customer product stores');
        return await this.categoryService.getCustomerProductsStores();
    }

}