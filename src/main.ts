import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // GLOBAL PREFIX
  app.setGlobalPrefix('/api');
  // VERSIONING
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
    prefix: 'v',
  });
  // CORS
  app.enableCors({
    allowedHeaders: ['authorization'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    optionsSuccessStatus: 200,
    origin: process.env.CORS_ORIGIN,
  });
  // VALIDATION
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  // SWAGGER (OPENAPI)
  const config = new DocumentBuilder()
    .setTitle('Review Guards and File Upload')
    .setDescription('The review API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  if (process.env.NODE_ENV.trim() === 'development') {
    SwaggerModule.setup('docs', app, documentFactory);
  }

  const PORT = process.env.APP_PORT ? parseInt(process.env.APP_PORT) : 3000;
  await app.listen(PORT, () => {
    console.log(`listening on ${PORT}`);
  });
}
bootstrap();
