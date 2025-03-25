"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const exception_filter_1 = require("./filters/exception.filter");
const logger_service_1 = require("./shared/services/logger/logger.service");
const swagger_1 = require("@nestjs/swagger");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const helmet_1 = require("helmet");
const express_1 = require("express");
const config_1 = require("@nestjs/config");
const http_proxy_middleware_1 = require("http-proxy-middleware");
const contextService = require("request-context");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const logger = app.get(logger_service_1.LoggerService);
    const config = app.get(config_1.ConfigService);
    app.useGlobalFilters(new exception_filter_1.GlobalExceptionFilter(logger));
    app.use(morgan(":method :url :status :res[content-length] - :response-time ms", {
        stream: { write: (message) => logger.info(message) },
    }));
    app.use((req, res, next) => {
        const allowedOrigins = [
            "http://localhost:3000",
            "http://127.0.0.1:3000",
            "http://localhost:5500",
            "http://127.0.0.1:5500",
            "http://localhost:8000",
            "http://127.0.0.1:8000",
            "http://13.201.102.229",
            "https://13.201.102.229",
            "http://nium.thestorywallcafe.com",
            "https://nium.thestorywallcafe.com",
            "https://nium-forex-agent-portal.vercel.app",
        ];
        const origin = req.headers.origin;
        if (allowedOrigins.includes(origin)) {
            res.header("Access-Control-Allow-Origin", origin);
        }
        res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, api_key, partner_id");
        res.header("Access-Control-Allow-Credentials", "true");
        if (req.method === "OPTIONS") {
            return res.sendStatus(200);
        }
        next();
    });
    app.use((0, helmet_1.default)());
    app.use((0, express_1.json)({ limit: "100mb" }));
    app.use(bodyParser.json({ limit: '100mb' }));
    app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));
    app.setGlobalPrefix("v1/api");
    app.use(contextService.middleware("request"));
    const proxyOptions = {
        target: "https://capture.kyc.idfy.com",
        changeOrigin: true,
        pathRewrite: {
            "^/captures": "/v2/captures",
        },
        onProxyReq: (proxyReq, req, res) => {
            proxyReq.setHeader("Origin", "https://capture.kyc.idfy.com");
        },
    };
    app.use("/captures", (0, http_proxy_middleware_1.createProxyMiddleware)(proxyOptions));
    const proxyOptionsEsign = {
        target: "https://app1.leegality.com",
        changeOrigin: true,
        pathRewrite: {
            "^/sign": "",
        },
        onProxyReq: (proxyReq, req, res) => {
            proxyReq.setHeader("Origin", "https://app1.leegality.com");
        },
    };
    app.use("/sign/*", (0, http_proxy_middleware_1.createProxyMiddleware)(proxyOptionsEsign));
    process.on("unhandledRejection", (reason, promise) => {
        console.error("Unhandled Rejection at:", promise, "reason:", reason);
    });
    const options = new swagger_1.DocumentBuilder()
        .setTitle(`InstaReM ${process.env.SERVICE_NAME}`)
        .setDescription(process.env.SERVICE_NAME)
        .setVersion("1.0")
        .addBearerAuth({
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
    }, "access_token")
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, options);
    swagger_1.SwaggerModule.setup("v1/api-docs", app, document);
    const port = config.get("PORT") || 3002;
    await app.listen(port);
    console.log(`🚀 App is running on port ${port}`);
}
bootstrap();
//# sourceMappingURL=main.js.map