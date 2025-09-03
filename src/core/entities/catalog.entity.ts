import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { SubCatalog } from "./sub-catalog.entity";

@Entity('catalogs')
export class Catalog {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ unique: true })
  name: string;

  @OneToMany(() => SubCatalog, (subCatalog) => subCatalog.catalog, { cascade: true, onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  subCatalogs: SubCatalog[];
}
