import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { RMQ_PATTERNS } from '../../../constants/general.constants';

@Injectable()
export class RabbitProducerService {
  constructor(@Inject('RABBIT_CLIENT_LOG_QUEUE') private client: ClientProxy) {}

  async onModuleInit() {
    await this.client.connect();
  }

  onModuleDestroy() {
    this.client.close();
  }

  sendServiceAuditLogToQueue(payload: object | string) {
    return this.client.emit({ cmd: RMQ_PATTERNS.SERVICE_AUDIT_LOGS }, payload);
  }
}
