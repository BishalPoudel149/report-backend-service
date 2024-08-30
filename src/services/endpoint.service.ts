import { Injectable } from '@nestjs/common';

@Injectable()
export class EndpointService {
    getEndpoints(): Record<string, string> {
      return {
        'Available Endpoints': '',
        '/': 'Returns a list of all available endpoints',
        '/user/login': 'POST: Login user',
        '/customer/products/:customeremail': 'GET: Fetch all product information for a specific customer',
        '/customer/stores/:customeremail/:product': 'GET: Fetch store locations for a specific product',
        '/customer/customers-products-stores': 'GET: Return all data related to customer products and stores',
      };
    }
}