import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Server } from 'node:http';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. Налаштування CORS (має бути одним із перших)
  const frontendUrl = process.env.FRONTEND_DOMAIN;
  app.enableCors({
    origin: [frontendUrl, 'http://localhost:5173'].filter(Boolean) as string[],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Accept',
      'X-Requested-With',
    ],
    exposedHeaders: ['Content-Length', 'X-JSON-Response-Length'],
    optionsSuccessStatus: 200,
    preflightContinue: false,
  });

  // 2. Мідлвари
  app.use(cookieParser());

  // 3. Валідація
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // 4. Swagger (Документація)
  const config = new DocumentBuilder()
    .setTitle('Future Academy API')
    .setDescription(
      'REST API for Future Academy: authentication, users, courses, public leads, and admin lead management.',
    )
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Paste access token received from POST /api/v1/auth/login',
      },
      'bearer',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    customSiteTitle: 'Future Academy API Docs',
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      docExpansion: 'list',
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  });

  // 5. Запуск сервера
  const port = process.env.PORT || 3000;
  const serverTimeout = Number(process.env.SERVER_TIMEOUT) || 30000;
  const keepaliveTimeout = Number(process.env.KEEPALIVE_TIMEOUT) || 65000;
  const requestTimeout = Number(process.env.REQUEST_TIMEOUT) || 45000;

  await app.listen(port);
  const server = app.getHttpServer() as Server;

  // Configure HTTP server timeouts
  server.setTimeout(serverTimeout);
  server.keepAliveTimeout = keepaliveTimeout;
  server.requestTimeout = requestTimeout;

  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`Swagger documentation: http://localhost:${port}/api`);
  console.log(
    `⏱️  Timeouts configured - Server: ${serverTimeout}ms, KeepAlive: ${keepaliveTimeout}ms, Request: ${requestTimeout}ms`,
  );
}
void bootstrap();
