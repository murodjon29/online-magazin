import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Catalog } from "./catalog.entity";
import { Category } from "./category.entity";

@Entity('sub_catalogs')
export class SubCatalog {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => Catalog, (catalog) => catalog.subCatalogs, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  catalog: Catalog;

  @OneToMany(() => Category, (category) => category.subCatalog, { cascade: true , onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  categories: Category[];
}
