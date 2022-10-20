import {
  Controller,
  Post,
  Body,
  Delete,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, LoginUserDto } from './dto/create-user.dto';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthUserDto } from './dto/auth-user.dto';
import { DepositToUserDto } from './dto/deposit-to-user.dto';
import { GetUser } from 'src/@shared/decorators/user.decorator';
import { User } from './entities/user.entity';
import { JwtAuthGuard } from 'src/@shared/guards/jwt-auth.guard';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create')
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ type: AuthUserDto })
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.userService.create(createUserDto);
    return AuthUserDto.toDto(user);
  }

  @Post('login')
  @ApiResponse({ type: AuthUserDto })
  async login(@Body() loginUserDto: LoginUserDto) {
    const user = await this.userService.login(loginUserDto);
    return AuthUserDto.toDto(user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async remove(@GetUser() user: User) {
    return await this.userService.remove(user.id);
  }

  @Post('deposit')
  @HttpCode(204)
  @ApiBody({ type: DepositToUserDto })
  @ApiResponse({ status: 204 })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async deposit(
    @GetUser() user: User,
    @Body() depositUserDto: DepositToUserDto,
  ) {
    await this.userService.deposit(user.id, depositUserDto.amount);
  }
}
