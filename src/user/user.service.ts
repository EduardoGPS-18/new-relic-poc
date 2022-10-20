import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto, LoginUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from 'src/@shared/strategies/jwt-auth.strategy';

@Injectable()
export class UserService {
  private logger: Logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const password = await bcrypt.hash(createUserDto.password, 10);
      const user = await this.userRepository.save({
        ...createUserDto,
        password,
      });
      this.logger.log(`EVENT: User ${user.userName} created`);
      return await this.updateAccessToken(user.id);
    } catch (err) {
      if (err.errno === 19) {
        throw new BadRequestException('User already exists');
      }
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;
    const user = await this.userRepository.findOne({
      where: { email },
    });
    if (!user) throw new BadRequestException('Invalid credentials');

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new BadRequestException('Invalid credentials');

    this.logger.log(`EVENT: User ${user.userName} logged in`);
    return await this.updateAccessToken(user.id);
  }

  private async updateAccessToken(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
    });
    const payload: JwtPayload = { email: user.email, sub: user.id };
    const accessToken = this.jwtService.sign(payload);
    return await this.userRepository.save({
      ...user,
      accessToken,
    });
  }

  async findOne(id: number) {
    return await this.userRepository.findOne({ where: { id } });
  }

  async remove(id: number) {
    const result = await this.userRepository.softDelete(id);
    this.logger.log(`EVENT: User ${id} removed`);
    if (!result.affected) throw new NotFoundException('User not found');
  }

  async deposit(id: number, amount: number) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    this.logger.log(`EVENT: User ${user.userName} deposited ${amount}`);
    return await this.userRepository.update(user.id, {
      balance: user.balance + amount,
    });
  }
}
