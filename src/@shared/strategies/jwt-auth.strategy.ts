import { ForbiddenException, Injectable } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entities/user.entity';

export type JwtPayload = { sub: number; email: string };

@Injectable()
export class JwtAuthStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({
      ignoreExpiration: false,
      secretOrKey: 'any_secret',
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    const { sub } = payload;

    const user = await this.userService.findOne(sub);
    if (!user) throw new ForbiddenException('User not found');

    return user;
  }
}
