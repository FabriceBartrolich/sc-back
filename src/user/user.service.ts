import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const newUser = this.userRepository.create(createUserDto);
    const user = await this.userRepository.save(newUser);
    return user;
  }

  async findAll() {
    return await this.userRepository.find();
  }

  async findOne(id: number) {
    const found = await this.userRepository.findOne({ where: { id: id } });
    if (!found) {
      throw new NotFoundException('L\'utilisateur n\'existe pas');
    }
    return found;
  }

async update(id: number, updateUserDto: UpdateUserDto) {
    const userToUpdate = await this.userRepository.findOne({ where: { id: id } });
        if (!userToUpdate) {
      throw new NotFoundException(`L'utilisateur d'id ${id} n'existe pas`);
    }
    Object.assign(userToUpdate, updateUserDto);
    return this.userRepository.save(userToUpdate);
}

  async remove(id: number) {
    const userToRemove = await this.userRepository.findOne({ where: { id: id} });
    if (!userToRemove) {
      throw new NotFoundException('L\'utilisateur n\'existe pas');
    }
    return this.userRepository.remove(userToRemove);
  }
}
