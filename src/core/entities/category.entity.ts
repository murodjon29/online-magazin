// category.entity.ts
import { Column, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn, JoinColumn } from "typeorm";
import { CategoryImage } from "./category-image.entity";
import { SubCatalog } from "./sub-catalog.entity";

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToOne(() => CategoryImage, (image) => image.category, {
    cascade: true,
    eager: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'image_id' , referencedColumnName: 'id' , } )
  image: CategoryImage;

  @ManyToOne(() => SubCatalog, (subCatalog) => subCatalog.categories)
  subCatalog: SubCatalog;
}
