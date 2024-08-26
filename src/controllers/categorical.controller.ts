import { Body, Controller, Get, Param } from "@nestjs/common";
import { CustomerDataService } from "src/services/category.service";

@Controller('customer')
export class CustomerDataController{
    constructor(private readonly categoryService:CustomerDataService){}

    @Get(':customeremail')
    productCategory(@Param() params:any){
        console.log(params.customeremail);
        return this.categoryService.customercategory(params.customeremail);
    }

}