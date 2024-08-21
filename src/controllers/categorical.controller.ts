import { Body, Controller, Get, Param } from "@nestjs/common";
import { CategoryService } from "src/services/category.service";

@Controller('customer')
export class CategoryController{
    constructor(private readonly categoryService:CategoryService){}

    @Get(':customeremail')
    productCategory(@Param() params:any){
        console.log(params.customeremail);
        return this.categoryService.customercategory(params.customeremail);
    }

}