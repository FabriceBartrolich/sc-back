import { Genre } from "src/genre/entities/genre.entity";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('show')
export class Show {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column({ type: 'varchar', length: 255 })
    title: string;

    @Column({ type: 'boolean' })
    is_finished: boolean;
    
    @Column({ type: 'text' })
    description: string | null;

    @Column({ type: 'varchar', length: 255 })
    poster_path: string;

    @Column()
    id_user: number;

      @Column()
    api_id: number;
   
    // Relations entre l'entité Show et l'entité Genre

    @ManyToMany(() => Genre, (genre) => genre.shows)
    @JoinTable({ // table de jointure définie du côté de l'entité propriétaire
    name: 'show_belongs_genre', // nom de la table de jointure
    joinColumn: { name: 'show_id', referencedColumnName: 'id' }, // colonne de cette entité dans la table de jointure
    inverseJoinColumn: { name: 'genre_id', referencedColumnName: 'id' } // colonne de l'entité cible dans la table de jointure
  })
  genres: Genre[];

  // Relations entre l'entité Show et l'entité User

  @ManyToMany(() => User, (user) => user.viewedShows)
  viewers: User[];

  
  @ManyToMany(() => User, (user) => user.wishedShows)
  wishers: User[];
 

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'id_user' })
  user: User;
}
