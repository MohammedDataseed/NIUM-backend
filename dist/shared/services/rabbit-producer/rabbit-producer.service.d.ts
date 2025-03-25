import { ClientProxy } from "@nestjs/microservices";
export declare class RabbitProducerService {
    private client;
    constructor(client: ClientProxy);
    onModuleInit(): Promise<void>;
    onModuleDestroy(): void;
    sendServiceAuditLogToQueue(payload: object | string): import("rxjs").Observable<any>;
}
