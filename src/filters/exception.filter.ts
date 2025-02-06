import { Catch, ArgumentsHost } from '@nestjs/common';
import { LoggerService } from '../shared/services/logger/logger.service';

@Catch()
export class GlobalExceptionFilter {
  constructor(private logger: LoggerService) {}

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    try {
      // parse sequelize error
      if (exception.name && exception.name.includes('Sequelize')) {
        exception = {
          response: {
            message: exception.message,
            error: exception.name,
          },
          status: 500,
        };
      }

      const { status, response: error } = exception;

      this.logger.error(
        `Name: ${error.error} | message: ${error.message} | status: ${error.statusCode}`,
      );
      response.status(status).json(error);
    } catch (err) {
      this.logger.error('Uncaught exception', err);
      return response.status(500).json({ message: 'Something went wrong' });
    }
  }
}
