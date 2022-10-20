import { ApiProperty } from '@nestjs/swagger';

export class AuthenticationBaseDto {
  @ApiProperty({
    description: `User's email`,
    example: 'john@doe.com',
  })
  email: string;

  @ApiProperty({
    description: `User's password`,
    example: 'johndoe123',
  })
  password: string;
}

export class CreateUserDto extends AuthenticationBaseDto {
  @ApiProperty({
    description: `User's name`,
    example: 'John Doe',
  })
  userName: string;
}

export class LoginUserDto extends AuthenticationBaseDto {}
