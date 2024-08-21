import { Injectable, NotFoundException } from "@nestjs/common";
import { DatabaseService } from "./database.service";

@Injectable()
export class CategoryService {

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


}