import { ApiProperty } from '@nestjs/swagger';
import { Product } from '../entities/product.entity';

export class BaseProductDto {
  @ApiProperty({
    description: `Product's name`,
  })
  name: string;

  @ApiProperty({
    description: `Product's price in cents`,
  })
  price: number;
}

export class CreateProductDto extends BaseProductDto {
  static toDto(product: Product): CreateProductDto {
    return {
      name: product.name,
      price: product.price,
    };
  }
}

export class ProductDto extends BaseProductDto {
  @ApiProperty({
    description: `Product's id`,
  })
  id: number;

  static toDto(product: Product): ProductDto {
    return {
      id: product.id,
      name: product.name,
      price: product.price,
    };
  }
}
