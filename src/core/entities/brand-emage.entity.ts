// brand-emage.entity.ts
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Brand } from './brand.entity';

@Entity('brand_image')
export class BrandImage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  url: string;

  @OneToOne(() => Brand, (brand) => brand.image)
  brand: Brand;
}
