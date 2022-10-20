import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { UserModule } from './user/user.module';
import { ProductModule } from './product/product.module';
import { JwtAuthGuard } from './@shared/guards/jwt-auth.guard';
import { JwtAuthStrategy } from './@shared/strategies/jwt-auth.strategy';
import { ShopModule } from './shop/shop.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      autoLoadEntities: true,
      database: join(__dirname, '..', '/db.sqlite'),
      synchronize: true,
      entities: [__dirname + '/**/entities/*.entity{.ts,.js}'],
      namingStrategy: new SnakeNamingStrategy(),
    }),
    UserModule,
    ProductModule,
    ShopModule,
  ],
  controllers: [],
  providers: [JwtAuthStrategy, JwtAuthGuard],
  exports: [],
})
export class AppModule {}
