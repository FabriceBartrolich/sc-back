import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateShowDto } from './dto/create-show.dto';
import { UpdateShowDto } from './dto/update-show.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Show } from './entities/show.entity';

@Injectable()
export class ShowService {
    constructor(
    @InjectRepository(Show) private readonly showRepository: Repository<Show>,
  ) {}
    async create(createShowDto: CreateShowDto) {
        const show = this.showRepository.create(createShowDto);
        return this.showRepository.save(show);
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

async update(id: number, updateShowDto: UpdateShowDto) {
    const showToUpdate = await this.showRepository.findOne({ where: { id: id } });
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
}
