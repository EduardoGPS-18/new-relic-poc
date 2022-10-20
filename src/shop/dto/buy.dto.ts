import { ApiProperty } from '@nestjs/swagger';

export class BuyDto {
  @ApiProperty({
    description: `The id's of the products`,
    type: [Number],
  })
  productsIds: number[];
}
