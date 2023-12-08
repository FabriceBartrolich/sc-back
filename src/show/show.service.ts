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
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['viewedShows'],
    });

    let show = await this.showRepository.findOne({ where: { api_id: showId } });

    if (!show) {
      const infos = await this.tmdbService.searchShowById(showId);

      show = await this.showRepository.save({
        api_id: showId,
        title: infos.name,
        poster_path: infos.poster_path,
        description: infos.overview,
        is_finished: infos.in_production,
        id_user: userId,
      });
    }
    user.viewedShows.push(show);
    await this.userRepository.save(user);
    return user;
  }

  async addShowWishedList(userId: number, showId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['wishedShows'],
    });
    let show = await this.showRepository.findOne({ where: { api_id: showId } });

    if (!show) {
      const infos = await this.tmdbService.searchShowById(showId);
      show = await this.showRepository.save({
        api_id: showId,
        title: infos.name,
        poster_path: infos.poster_path,
        description: infos.overview,
        is_finished: infos.in_production,
        id_user: userId,
      });
    }

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

    const showIndex = user.wishedShows.findIndex((show) => show.id == showId);
    if (showIndex === -1) {
      throw new NotFoundException(
        `La série avec l'id n°${showId} n'est pas dans la liste de vos séries à voir.`,
      );
    }
    user.wishedShows.splice(showIndex, 1);

    await this.userRepository.save(user);

    return `La série avec l'id n°${showId} a été supprimée de la liste de vos séries à voir.`;
  }

  async removeViewedShow(userId: number, showId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['viewedShows'],
    });
    if (!user) {
      throw new NotFoundException(
        `L'utilisateur avec l'id n°${userId} n'existe pas.`,
      );
    }

    const showIndex = user.viewedShows.findIndex((show) => show.id == showId);

    if (showIndex === -1) {
      throw new NotFoundException(
        `La série avec l'id n°${showId} n'est pas dans la liste de vos séries vues.`,
      );
    }

    user.viewedShows.splice(showIndex, 1);

    await this.userRepository.save(user);

    return `La série avec l'id n°${showId} a été supprimée de la liste de vos séries vues.`;
  }
}
