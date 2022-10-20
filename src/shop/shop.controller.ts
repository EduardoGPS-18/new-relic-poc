import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Param,
  Logger,
} from '@nestjs/common';
import { ShopService } from './shop.service';
import { BuyDto } from './dto/buy.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/@shared/guards/jwt-auth.guard';
import { GetUser } from 'src/@shared/decorators/user.decorator';
import { User } from 'src/user/entities/user.entity';
import { UserController } from 'src/user/user.controller';

@Controller('shop')
export class ShopController {
  constructor(private readonly shopService: ShopService) {}

  @Post('buy/:productId')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async buy(@GetUser() buyer: User, @Body() buyDto: BuyDto) {
    return await this.shopService.buy(buyer, buyDto);
  }

  @Get('purchases')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async listPurchases(@GetUser() user: User) {
    return await this.shopService.listPurchases(user);
  }

  @Get('purchase/:purchaseId')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async listPurchaseById(
    @Param('purchaseId') purchaseId: number,
    @GetUser() user: User,
  ) {
    return await this.shopService.listPurchaseById(user, purchaseId);
  }
}
