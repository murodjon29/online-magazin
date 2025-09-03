import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Category } from "./category.entity";

@Entity('category_images')
export class CategoryImage {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  url: string;

  @OneToOne(() => Category, (category) => category.image, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  category: Category;
}
