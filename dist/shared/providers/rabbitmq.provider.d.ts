import { ConfigService } from '@nestjs/config';
declare class ClientProxyMock {
    connect(): void;
    emit(pattern: string, data: any): import("rxjs").Observable<any>;
    close(): void;
}
export declare const RabbitProvider: {
    provide: string;
    useFactory: (configService: ConfigService) => ClientProxyMock;
    inject: (typeof ConfigService)[];
};
export {};
