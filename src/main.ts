import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. Налаштування CORS (має бути одним із перших)
  const frontendUrl = process.env.FRONTEND_DOMAIN;
  app.enableCors({
    origin: [
      frontendUrl,
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:5173',
      'https://your-academy.vercel.app', // заміниш на свій реальний домен, коли задеплоїш фронт
    ].filter(Boolean) as string[],
    credentials: true,
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
    .setDescription('Документація API занять')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // 5. Запуск сервера
  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`Swagger documentation: http://localhost:${port}/api`);
}
void bootstrap();
