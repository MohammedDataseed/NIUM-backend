import { ConfigService } from '@nestjs/config';
import {
  ClientOptions,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { of } from 'rxjs';
import { NODE_ENV_VALUES } from '../../constants/general.constants';

class ClientProxyMock {
  connect() {}
  emit(pattern: string, data: any) {
    return of(data);
  }
  close() {}
}

export const RabbitProvider = {
  provide: 'RABBIT_CLIENT_LOG_QUEUE',
  useFactory: (configService: ConfigService) => {
    if (configService.get('NODE_ENV') === NODE_ENV_VALUES.TEST) {
      return new ClientProxyMock();
    }
    const rabbitUrl = configService.get<string>('RABBIT_URL');
    if (!rabbitUrl) return null; // Prevents connection errors

    const params: ClientOptions = {
      transport: Transport.RMQ,
      options: {
        urls: [rabbitUrl],
        queue: configService.get('QUEUE_NAME'),
        queueOptions: {
          durable: true,
        },
      },
    };
    return ClientProxyFactory.create(params);
  },
  inject: [ConfigService],
};
