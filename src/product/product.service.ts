import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { In, Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductService {
  private logger: Logger = new Logger(ProductService.name);
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}
  async create(inserter: User, createProductDto: CreateProductDto) {
    if (createProductDto.price <= 0)
      throw new Error('Price must be greater than 0');
    this.logger.log(`EVENT: User ${inserter.userName} has created a product`);
    return await this.productRepository.save({
      ...createProductDto,
      owner: inserter,
    });
  }

  async findAll() {
    return await this.productRepository.find();
  }

  async findByIds(ids: number[]) {
    return await this.productRepository.find({
      where: { id: In(ids) },
      relations: ['owner'],
    });
  }

  async findOne(id: number) {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async remove(remover: User, id: number) {
    const product = await this.productRepository.findOne({
      where: { id, owner: { id: remover.id } },
      relations: ['user'],
    });
    this.logger.log(`EVENT: User ${remover.userName} has removed an product`);
    if (product) throw new NotFoundException('Product not found');
    await this.productRepository.softDelete({ id });
  }
}
