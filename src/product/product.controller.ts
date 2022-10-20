import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto, ProductDto } from './dto/create-product.dto';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/@shared/guards/jwt-auth.guard';
import { GetUser } from 'src/@shared/decorators/user.decorator';
import { User } from 'src/user/entities/user.entity';

@ApiTags('Product')
@Controller('product')
@UseGuards(JwtAuthGuard)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @ApiBearerAuth()
  @ApiBody({ type: CreateProductDto })
  @ApiResponse({ type: ProductDto })
  async create(
    @GetUser() inserter: User,
    @Body() createProductDto: CreateProductDto,
  ): Promise<ProductDto> {
    const product = await this.productService.create(
      inserter,
      createProductDto,
    );
    return ProductDto.toDto(product);
  }

  @Get()
  @ApiBearerAuth()
  @ApiResponse({ type: ProductDto })
  async findAll() {
    const products = await this.productService.findAll();
    return products.map(ProductDto.toDto);
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiResponse({ type: ProductDto })
  async findOne(@Param('id') id: string) {
    const product = await this.productService.findOne(+id);
    return ProductDto.toDto(product);
  }

  @Delete(':id')
  @ApiBearerAuth()
  async remove(@GetUser() user: User, @Param('id') id: string) {
    await this.productService.remove(user, +id);
  }
}
