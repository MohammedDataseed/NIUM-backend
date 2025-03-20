import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { AppModule } from "./app.module";
import { GlobalExceptionFilter } from "./filters/exception.filter";
import { LoggerService } from "./shared/services/logger/logger.service";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import * as morgan from "morgan";
import helmet from "helmet";
import { json } from "express"; // Import express json middleware
import { ConfigService } from "@nestjs/config";
import * as httpProxy from "http-proxy-middleware";
import { Request, Response, NextFunction } from "express";
import { createProxyMiddleware, Options } from "http-proxy-middleware";
const contextService = require("request-context");

async function bootstrap() {
  // initiate express app
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const logger = app.get<LoggerService>(LoggerService);
  const config = app.get<ConfigService>(ConfigService);
  app.useGlobalFilters(new GlobalExceptionFilter(logger));

  // app use global middleware
  app.use(
    morgan(":method :url :status :res[content-length] - :response-time ms", {
      stream: { write: (message) => logger.info(message) },
    })
  );

  app.use((req: Request, res: Response, next: NextFunction) => {
    const allowedOrigins = [
      "http://localhost:3000",
      "http://127.0.0.1:3000",
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

    res.header(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS"
    );
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.header("Access-Control-Allow-Credentials", "true");

    if (req.method === "OPTIONS") {
      return res.sendStatus(200);
    }

    next();
  });

  app.use(helmet());
  // Increase the JSON body size limit to 1MB (or adjust as needed)
  app.use(json({ limit: "5mb" })); // 5mb = 5120 * 1024 bytes
  app.setGlobalPrefix("v1/api");
  app.use(contextService.middleware("request"));

  const proxyOptions = {
    target: "https://capture.kyc.idfy.com", // Target API
    changeOrigin: true, // Correct origin header handling
    pathRewrite: {
      "^/captures": "/v2/captures", // Rewrite '/captures' to '/v2/captures'
    },
    onProxyReq: (proxyReq, req, res) => {
      // Optional: Set additional headers if needed
      proxyReq.setHeader("Origin", "https://capture.kyc.idfy.com");
    },
  };
  // Apply proxy middleware for '/captures' route
  app.use("/captures", createProxyMiddleware(proxyOptions));

  const proxyOptionsEsign = {
    target: "https://app1.leegality.com", // Target e-sign service

    changeOrigin: true, // Correct origin header handling
    pathRewrite: {
      "^/sign": "", // Rewrite '/captures' to '/v2/captures'
    },
    onProxyReq: (proxyReq, req, res) => {
      // Optional: Set additional headers if needed
      proxyReq.setHeader("Origin", "https://app1.leegality.com");
    },
  };
  // Apply proxy middleware for '/captures' route
  app.use("/sign/*", createProxyMiddleware(proxyOptionsEsign));

  // listen for kill signal
  // app.enableShutdownHooks();
  // Global Unhandled Promise Catcher
  process.on("unhandledRejection", (reason, promise) => {
    console.error("Unhandled Rejection at:", promise, "reason:", reason);
    // logger.error("Unhandled Promise Rejection", reason);
  });

  // Set Swagger Documentation
  const options = new DocumentBuilder()
    .setTitle(`InstaReM ${process.env.SERVICE_NAME}`)
    .setDescription(process.env.SERVICE_NAME)
    .setVersion("1.0")
    .addBearerAuth(
      {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
      "access_token" // 🔹 Name of the security scheme (important)
    )
    .build();
  const document = SwaggerModule.createDocument(app, options);
  // SwaggerModule.setup("v1/api-docs", app, document);
  SwaggerModule.setup("v1/api-docs", app, document);

  const port = config.get<number>("PORT") || 3002; // Default to 3002 if undefined

  await app.listen(port);
  console.log(`🚀 App is running on port ${port}`);
}
bootstrap();
