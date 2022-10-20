import { Purchase } from 'src/shop/entities/purchase.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userName: string;

  @Column({ unique: true })
  email: string;

  @Column({ default: 0 })
  balance: number;

  @ManyToMany(() => Purchase, (purchase) => purchase.user)
  purchases: Purchase[];

  @Column()
  password: string;

  @Column({ nullable: true })
  accessToken: string;

  @DeleteDateColumn()
  deletedAt: Date;
}
