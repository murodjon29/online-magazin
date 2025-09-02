import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { resolve } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { config } from 'src/config';
import { FileModule } from './file/file.module';
import { CategoryModule } from './category/category.module';
import { BrandModule } from './brand/brand.module';
import { AdminModule } from './admin/admin.module';
import { JwtModule } from '@nestjs/jwt';
import { CatalogModule } from './catalog/catalog.module';
import { SubCatalogModule } from './sub-catalog/sub-catalog.module';

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
    CategoryModule,
    BrandModule,
    AdminModule,
    CatalogModule,
    SubCatalogModule,
  ],
})
export class AppModule {}
