import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Genre } from './entities/genre.entity';

@Injectable()
export class GenreService {
    constructor(
    @InjectRepository(Genre)
    private readonly genreRepository: Repository<Genre>,
  ) { }

  async create(createGenreDto: CreateGenreDto) {
    const genre = this.genreRepository.create(createGenreDto);
    return this.genreRepository.save(genre);
  }

  async findAll() {
    return this.genreRepository.find();
  }

async findOne(id: number) {
    const found = await this.genreRepository.findOne({ where: { id: id } });
    if (!found) {
      throw new NotFoundException(`La catégorie d'id ${id} n'existe pas.`);
    }
    return found;
}

async update(id: number, updateGenreDto: UpdateGenreDto) {
    const genreToUpdate = await this.genreRepository.findOne({ where: { id: id } });
    if (!genreToUpdate) {
        throw new NotFoundException(`La catégorie d'id ${id} n'existe pas.`);
    }
    Object.assign(genreToUpdate, updateGenreDto);
    return await this.genreRepository.save(genreToUpdate);
}

  async remove(id: number) {
    const result = await this.genreRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`La catégorie d'id ${id} n'existe pas.`);
    }
  }
}
