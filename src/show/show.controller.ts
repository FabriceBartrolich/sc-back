import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ShowService } from './show.service';
import { TmdbService } from 'src/services/tmdb/tmdb.service';
import { CreateShowDto } from './dto/create-show.dto';
import { UpdateShowDto } from './dto/update-show.dto';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('show')
@Controller('show')
// @UseGuards(AuthGuard('jwt')) 
export class ShowController {
  constructor(private readonly showService: ShowService, private tmdbService: TmdbService) {}

  @Post()
  create(@Body() createShowDto: CreateShowDto) {
    return this.showService.create(createShowDto);
  }


  @Post('search/tvshow') 
  searchTvShow(@Body () Body) {
    console.log(Body.title);
    
    return this.tmdbService.searchShow(Body.title);
  }

    @Get('search/tvshow/:id') 
  searchTvShowById(@Param ('id') id: number) {
    console.log('ce que je chereche '+typeof id);
    
    return this.tmdbService.searchShowById(+id);
  }


  @Get()
  findAll() {
    return this.showService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.showService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateShowDto: UpdateShowDto) {
    return this.showService.update(+id, updateShowDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.showService.remove(+id);
  }
}
