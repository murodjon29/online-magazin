import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from 'src/config';
import { HttpStatus, ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import * as express from 'express';

export class Application {
  public static async main(): Promise<void> {
    const app = await NestFactory.create(AppModule);

    app.enableCors({
      origin: '*',
    });

    // ✅ uploads papkasini public qilish
    app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      }),
    );

    await app.listen(config.API_PORT || 8080);
    console.log(`Server started on port ${config.API_PORT || 8080}`);
  }
}
