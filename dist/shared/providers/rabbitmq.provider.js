"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RabbitProvider = void 0;
const config_1 = require("@nestjs/config");
const microservices_1 = require("@nestjs/microservices");
const rxjs_1 = require("rxjs");
const general_constants_1 = require("../../constants/general.constants");
class ClientProxyMock {
    connect() { }
    emit(pattern, data) {
        return (0, rxjs_1.of)(data);
    }
    close() { }
}
exports.RabbitProvider = {
    provide: 'RABBIT_CLIENT_LOG_QUEUE',
    useFactory: (configService) => {
        if (configService.get('NODE_ENV') === general_constants_1.NODE_ENV_VALUES.TEST) {
            return new ClientProxyMock();
        }
        const rabbitUrl = configService.get('RABBIT_URL');
        if (!rabbitUrl)
            return null;
        const params = {
            transport: microservices_1.Transport.RMQ,
            options: {
                urls: [rabbitUrl],
                queue: configService.get('QUEUE_NAME'),
                queueOptions: {
                    durable: true,
                },
            },
        };
        return microservices_1.ClientProxyFactory.create(params);
    },
    inject: [config_1.ConfigService],
};
//# sourceMappingURL=rabbitmq.provider.js.map