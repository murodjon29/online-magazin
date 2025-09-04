  import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
  import { BrandImage } from "./brand-emage.entity";

  @Entity('brands')
  export class Brand {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    description: string;
      
    @OneToOne(() => BrandImage, (image) => image.brand, { cascade: true, onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinColumn({ name: 'image_id' , referencedColumnName: 'id' , } )
    image: BrandImage;
  }
