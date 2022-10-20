import { ApiProperty } from '@nestjs/swagger';

export class DepositToUserDto {
  @ApiProperty({
    description: 'Amount to deposit',
  })
  amount: number;
}
