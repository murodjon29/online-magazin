import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { resolve } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { config } from 'src/config';
import { FileModule } from './file/file.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: config.DB_URL,
      entities: ['dist/core/entity/*.entity{.ts,.js}'],
      synchronize: true,
      logging: true,
      autoLoadEntities: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: resolve(__dirname, '..', '..', '..', '..', 'uploads'),
      serveRoot: '/uploads',
    }),

    // Modules

    FileModule,
  ],
})
export class AppModule {}
