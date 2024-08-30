import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    NotFoundException,
    HttpStatus,
    Injectable,
    Inject,
  } from '@nestjs/common';
  import { Request, Response } from 'express';
import { EndpointService } from 'src/services/endpoint.service';
  
  @Injectable()
  @Catch(NotFoundException)
  export class NotFoundExceptionFilter implements ExceptionFilter {
    constructor(private readonly endpointService: EndpointService) {}
  
    catch(exception: NotFoundException, host: ArgumentsHost) {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();
      const request = ctx.getRequest<Request>();
  
      // Fetch the list of available endpoints
      const endpoints = this.endpointService.getEndpoints();
  
      // Respond with the endpoints information
      response.status(HttpStatus.NOT_FOUND).json({
        statusCode: HttpStatus.NOT_FOUND,
        message: `Cannot ${request.method} ${request.url}`,
        availableEndpoints: endpoints,
      });
    }
  }