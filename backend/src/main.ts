import { NestFactory } from '@nestjs/core';
import * as dns from 'dns';
dns.setServers(['8.8.8.8']);

import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { join } from 'path';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.enableCors({
    origin: [
      'http://localhost:5173', 
      'http://localhost:3000', 
      process.env.FRONTEND_URL || 'https://north-cl-test-gemini-nsnd.vercel.app'
    ],
    credentials: true,
  });

  // Serve uploaded files statically
  app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));

  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');
  console.log(`🚀 NorthIndia Connect API running on http://localhost:${port}`);
}
bootstrap();
