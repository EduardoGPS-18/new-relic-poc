import { Module } from '@nestjs/common';
import { ShopService } from './shop.service';
import { ShopController } from './shop.controller';
import { ProductModule } from 'src/product/product.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Purchase } from './entities/purchase.entity';

@Module({
  controllers: [ShopController],
  providers: [ShopService],
  imports: [ProductModule, TypeOrmModule.forFeature([Purchase])],
})
export class ShopModule {}
