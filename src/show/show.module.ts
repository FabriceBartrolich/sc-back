import { Module } from '@nestjs/common';
import { ShowService } from './show.service';
import { TmdbService } from 'src/services/tmdb/tmdb.service';
import { ShowController } from './show.controller';
import { Show } from './entities/show.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Show]), TypeOrmModule.forFeature([User])],
  controllers: [ShowController],
  providers: [ShowService, TmdbService],
})
export class ShowModule {}
