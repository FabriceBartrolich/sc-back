import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateShowDto } from './dto/create-show.dto';
import { UpdateShowDto } from './dto/update-show.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Show } from './entities/show.entity';
import { User } from 'src/user/entities/user.entity';
import { TmdbService } from 'src/services/tmdb/tmdb.service';

@Injectable()
export class ShowService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Show)
    private readonly showRepository: Repository<Show>,
    private readonly tmdbService: TmdbService,
  ) {}
  async create(createShowDto: CreateShowDto) {
    const show = this.showRepository.create(createShowDto);
    return this.showRepository.save(show);
  }

  async addShowViewedList(userId: number, showId: number) {
    // 1.Récupération de l'utilisateur
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['viewedShows'],
    });
    // 2.Récupération de la série qui correspond à l'id
    
    let show = await this.showRepository.findOne({ where: { api_id: showId } });
    console.log(show);
  
    if (!show) {
     //J'ai besoin de récupérer les infos de la série depuis l'API
const infos = await this.tmdbService.searchShowById(showId);

      show = await this.showRepository.save({ api_id: showId, title: infos.name, poster_path: infos.poster_path, description: infos.overview, is_finished: infos.in_production, id_user: userId   });
      
    }
    //  return {show, showId}
      
    // 3.Ajout de la série dans la liste des séries vues de l'utilisateur
    user.viewedShows.push(show);
    await this.userRepository.save(user);
    return user;
  }

  async addShowWishedList(userId: number, showId: number) {
    // 1.Récupération de l'utilisateur
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['wishedShows'],
    });
    // 2.Récupération de la série qui correspond à l'id
    let show = await this.showRepository.findOne({ where: { api_id : showId } });
    console.log(show);
    
    if (!show) {
      const infos = await this.tmdbService.searchShowById(showId);
      show = await this.showRepository.save({ api_id: showId, title: infos.name, poster_path: infos.poster_path, description: infos.overview, is_finished: infos.in_production, id_user: userId   });
    }
   
    // 3.Ajout de la série dans la liste des séries vues de l'utilisateur
    user.wishedShows.push(show);
    await this.userRepository.save(user);
     return user;
  }

  async findAll() {
    return this.showRepository.find();
  }

  async findOne(id: number) {
    const found = await this.showRepository.findOne({ where: { id: id } });
    if (!found) {
      throw new NotFoundException(`La série avec l'id n°${id} n'existe pas.`);
    }
    return found;
  }

  async findViewedShows(id: number) {
    const me = await this.userRepository.findOne({
      where: { id: id },
      relations: ['viewedShows'],
    });
    if (!me) {
      throw new NotFoundException(
        `L'utilisateur avec l'id n°${id} n'existe pas.`,
      );
    }
    return me.viewedShows;
  }

  async findWishedShows(id: number) {
    const me = await this.userRepository.findOne({
      where: { id: id },
      relations: ['wishedShows'],
    });
    if (!me) {
      throw new NotFoundException(
        `L'utilisateur avec l'id n°${id} n'existe pas.`,
      );
    }
    return me.wishedShows;
  }

  async update(id: number, updateShowDto: UpdateShowDto) {
    const showToUpdate = await this.showRepository.findOne({
      where: { id: id },
    });
    if (!showToUpdate) {
      throw new NotFoundException(`La série avec l'id n°${id} n'existe pas.`);
    }
    Object.assign(showToUpdate, updateShowDto);
    return this.showRepository.save(showToUpdate);
  }

  async remove(id: number) {
    const result = await this.showRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`La série avec l'id n°${id} n'existe pas.`);
    }
    return `La série avec l'id n°${id} a été supprimée avec succès.`;
  }

  //   async removeWishedShow(userId: number, showId: number) {
  //   const user = await this.userRepository.findOne({ where: { id: userId }, relations: ['wishedShows'] });
  //   if (!user) {
  //     throw new NotFoundException(`L'utilisateur avec l'id n°${userId} n'existe pas.`);
  //   }

  //   const showToRemove = user.wishedShows.find(show => show.id === showId);
  //   if (!showToRemove) {
  //     throw new NotFoundException(`La série avec l'id n°${showId} n'est pas dans la liste de vos séries à voir.`);
  //   }

  //   user.wishedShows = user.wishedShows.filter(show => show.id !== showId);
  //   await this.userRepository.save(user);

  //   return `La série avec l'id n°${showId} a été supprimée de la liste de vos séries à voir.`;
  // }

  async removeWishedShow(userId: number, showId: number) {
    // Récupère l'utilisateur et ses séries souhaitées
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['wishedShows'],
    });
    if (!user) {
      throw new NotFoundException(
        `L'utilisateur avec l'id n°${userId} n'existe pas.`,
      );
    }

    // Trouve l'indice de la série à retirer
    const showIndex = user.wishedShows.findIndex((show) => show.id == showId);
    // return {showIndex}
    if (showIndex === -1) {
      throw new NotFoundException(
        `La série avec l'id n°${showId} n'est pas dans la liste de vos séries à voir.`,
      );
    }

    // Retire la série de la liste
    user.wishedShows.splice(showIndex, 1);

    // Sauvegarde les modifications
    await this.userRepository.save(user);

    return `La série avec l'id n°${showId} a été supprimée de la liste de vos séries à voir.`;
  }

  async removeViewedShow(userId: number, showId: number) {
    // Récupère l'utilisateur et ses séries souhaitées
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['viewedShows'],
    });
    if (!user) {
      throw new NotFoundException(
        `L'utilisateur avec l'id n°${userId} n'existe pas.`,
      );
    }

    // Trouve l'indice de la série à retirer
    const showIndex = user.viewedShows.findIndex((show) => show.id == showId);
    // return {showIndex}
    if (showIndex === -1) {
      throw new NotFoundException(
        `La série avec l'id n°${showId} n'est pas dans la liste de vos séries vues.`,
      );
    }

    // Retire la série de la liste
    user.viewedShows.splice(showIndex, 1);

    // Sauvegarde les modifications
    await this.userRepository.save(user);

    return `La série avec l'id n°${showId} a été supprimée de la liste de vos séries vues.`;
  }
}
