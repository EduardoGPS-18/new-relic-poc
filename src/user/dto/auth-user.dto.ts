import { ApiProperty } from '@nestjs/swagger';
import { User } from '../entities/user.entity';

export class AuthUserDto {
  @ApiProperty({
    description: `User's id`,
    type: Number,
  })
  id: number;

  @ApiProperty({
    description: `User's name`,
    type: String,
  })
  userName: string;

  @ApiProperty({
    description: `User's email`,
    type: String,
  })
  email: string;

  @ApiProperty({
    description: `User's access token`,
    type: String,
  })
  accessToken: string;

  static toDto(user: User): AuthUserDto {
    const { id, userName, email, accessToken } = user;
    return { id, userName, email, accessToken };
  }
}
