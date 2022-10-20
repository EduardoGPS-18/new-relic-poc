import {
  BadGatewayException,
  BadRequestException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomInt } from 'crypto';
import { ProductService } from 'src/product/product.service';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { BuyDto } from './dto/buy.dto';
import { Purchase } from './entities/purchase.entity';

@Injectable()
export class ShopService {
  private logger: Logger = new Logger(ShopService.name);

  constructor(
    @InjectRepository(Purchase)
    private purchaseRepository: Repository<Purchase>,
    private productService: ProductService,
  ) {}

  async buy(buyer: User, buyDto: BuyDto) {
    const products = await this.productService.findByIds(buyDto.productsIds);
    if (products.length !== buyDto.productsIds.length)
      throw new BadRequestException('Some products were not found');
    if (products.length === 0)
      throw new BadRequestException('No products were found');
    if (products.map((p) => p.owner).some((u) => u.id === buyer.id)) {
      throw new BadRequestException('You can not buy your own products');
    }
    const totalPrice = products.reduce(
      (acc, product) => acc + product.price,
      0,
    );
    this.logger.log(
      `User ${buyer.userName} has bought with total price: ${totalPrice}`,
    );

    if (randomInt(100) > 50) {
      throw new BadGatewayException('Payment failed in card gateway');
    }

    await this.purchaseRepository.save({
      user: buyer,
      totalPrice: totalPrice,
      product: products,
    });
  }

  async listPurchases(user: User) {
    return await this.purchaseRepository.find({
      where: { user: { id: user.id } },
    });
  }

  async listPurchaseById(user: User, purchaseId: number) {
    const purchase = await this.purchaseRepository.findOne({
      where: { id: purchaseId, user: { id: user.id } },
      relations: ['product'],
    });
    if (!purchase) throw new BadRequestException('Purchase not found');

    return { ...purchase };
  }
}
