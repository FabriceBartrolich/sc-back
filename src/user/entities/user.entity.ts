import { Show } from "src/show/entities/show.entity";
import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  username: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'char', length: 60 })
  password: string;

  // Relations entre l'entité User et l'entité Show
  
  @ManyToMany(() => Show, show => show.viewers)
  @JoinTable({ // table de jointure définie du côté de l'entité propriétaire
    name: 'user_views_show', // nom de la table de jointure
    joinColumn: { name: 'id_user', referencedColumnName: 'id' }, // colonne de cette entité dans la table de jointure
    inverseJoinColumn: { name: 'id_show', referencedColumnName: 'id' } // colonne de l'entité cible dans la table de jointure
  })
  viewedShows: Show[];

  @ManyToMany(() => Show, show => show.wishers)
  @JoinTable({ // table de jointure définie du côté de l'entité propriétaire
    name: 'user_wishes_show', // nom de la table de jointure
    joinColumn: { name: 'id_user', referencedColumnName: 'id' }, // colonne de cette entité dans la table de jointure
    inverseJoinColumn: { name: 'id_show', referencedColumnName: 'id' } // colonne de l'entité cible dans la table de jointure
  })
  wishedShows: Show[];
  
  @OneToMany(() => Show, (show) => show.user)
  shows: Show[];

}
