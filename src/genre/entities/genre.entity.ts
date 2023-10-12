import { Show } from "src/show/entities/show.entity";
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({name : 'genre'})
export class Genre {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column({ type: 'varchar', length: 100 })
    genre: string;

  // Relations entre l'entité Genre et l'entité Show

    @ManyToMany(() => Show, (show) => show.genres)
  shows: Show[];
}
