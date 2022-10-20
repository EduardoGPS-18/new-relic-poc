import { Product } from 'src/product/entities/product.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('purchases')
export class Purchase {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.purchases)
  user: User;

  @Column()
  totalPrice: number;

  @ManyToMany(() => Product, (product) => product.purchase)
  @JoinTable({
    name: 'product_purchase',
    inverseJoinColumn: { name: 'purchaseId', referencedColumnName: 'id' },
    joinColumn: { name: 'productId', referencedColumnName: 'id' },
  })
  product: Product[];

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
