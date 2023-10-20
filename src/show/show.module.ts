import { Module } from '@nestjs/common';
import { ShowService } from './show.service';
import { TmdbService } from 'src/services/tmdb/tmdb.service';
import { ShowController } from './show.controller';
import { Show } from './entities/show.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Show]),],
  controllers: [ShowController],
  providers: [ShowService, TmdbService],
})
export class ShowModule {}
