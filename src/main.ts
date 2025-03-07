import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { AppModule } from "./app.module";
import { GlobalExceptionFilter } from "./filters/exception.filter";
import { LoggerService } from "./shared/services/logger/logger.service";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import * as morgan from "morgan";
import helmet from "helmet";
import { json } from 'express'; // Import express json middleware
import { ConfigService } from "@nestjs/config";
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
  app.enableCors({
    origin: [
      "http://localhost:3000",
      "http://127.0.0.1:3000",
      "http://localhost:8000",
      "http://127.0.0.1:8000",
      "http://nium.thestorywallcafe.com",
      "https://nium-forex-agent-portal.vercel.app",
      "*",
    ], // Allow frontend on localhost
    credentials: true,
    methods: ["GET", "POST", "PUT"], // Explicitly allow methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allow required headers
  });

  app.use(helmet());
  // Increase the JSON body size limit to 1MB (or adjust as needed)
  app.use(json({ limit: '5mb' })); // 5mb = 5120 * 1024 bytes
  app.setGlobalPrefix("v1/api");
  app.use(contextService.middleware("request"));

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
  SwaggerModule.setup("v1/api-docs", app, document);

  
  const port = config.get<number>("PORT") || 3002; // Default to 3002 if undefined

  await app.listen(port);
  console.log(`🚀 App is running on port ${port}`);
}
bootstrap();
