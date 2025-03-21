import { Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { LoggerService } from '../shared/services/logger/logger.service';

@Catch()
export class GlobalExceptionFilter {
  constructor(private logger: LoggerService) {}

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    try {
      let status = 500;
      let errorResponse = {
        message: 'Something went wrong',
        error: 'Internal Server Error',
        statusCode: 500,
      };

      // Handle Sequelize errors
      if (exception.name && exception.name.includes('Sequelize')) {
        status = 500;
        errorResponse = {
          message: exception.message,
          error: exception.name,
          statusCode: 500,
        };
      }
      // Handle NestJS HTTP exceptions
      else if (exception instanceof HttpException) {
        status = exception.getStatus();
        errorResponse = exception.getResponse() as any;
      }
      // Handle unexpected errors
      else {
        this.logger.error('Unexpected error:', exception);
      }

      // Log structured error message
      this.logger.error(
        `Name: ${errorResponse.error} | Message: ${errorResponse.message} | Status: ${errorResponse.statusCode}`,
      );

      response.status(status).json(errorResponse);
    } catch (err) {
      this.logger.error('Uncaught exception in GlobalExceptionFilter:', err);
      return response.status(500).json({ message: 'Something went wrong' });
    }
  }
}
