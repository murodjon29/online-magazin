import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Carusel {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string

    @Column()
    url: string
}
