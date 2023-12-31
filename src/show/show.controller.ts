import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  ForbiddenException,
  Query,
} from '@nestjs/common';
import { ShowService } from './show.service';
import { TmdbService } from 'src/services/tmdb/tmdb.service';
import { CreateShowDto } from './dto/create-show.dto';
import { UpdateShowDto } from './dto/update-show.dto';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { log } from 'console';

interface SeachTvShowBody {
  title: string;
  userId: number;
}
@ApiTags('show')
@Controller('show')
// @UseGuards(AuthGuard('jwt'))
export class ShowController {
  constructor(
    private readonly showService: ShowService,
    private tmdbService: TmdbService,
  ) {}
  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() createShowDto: CreateShowDto) {
    return this.showService.create(createShowDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('viewedShows')
  addShowViewedList(@Body() body: { showId: number }, @Request() req) {
    const user = req.user;
    return this.showService.addShowViewedList(user.id, body.showId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('wishedShows')
  addShowWishedList(@Body() body, @Request() req) {
    const user = req.user;
    return this.showService.addShowWishedList(user.id, body.showId);
  }

  @Get('popular/tvshows')
  getPopularTvShows(@Query('page') page: number) {
    return this.tmdbService.getPopularShows(page);
  }

  @Post('search/tvshow')
  searchTvShow(@Body() body: SeachTvShowBody) {
    return this.tmdbService.searchShow(body.title, body.userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('viewed')
  async getViewedShows(@Request() req) {
    const user = req.user;
    return (await this.showService.findViewedShows(user.id)).sort((a,b) => b.id - a.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('wished/:userId')
  async getWishedShows(@Param('userId') userId: number) {
    return await this.showService.findWishedShows(userId);
  }

  @Get('search/tvshow/:id')
  searchTvShowById(@Param('id') id: number) {
    return this.tmdbService.searchShowById(+id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  findAll() {
    return this.showService.findAll();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.showService.findOne(+id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateShowDto: UpdateShowDto) {
    return this.showService.update(+id, updateShowDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.showService.remove(+id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('wished/:userId/:showId')
  async removeWishedShow(
    @Param('userId') userId: number,
    @Param('showId') showId: number,
    @Request() req,
  ) {
    // return { userId, showId}
    const user = req.user;
    // return { user}

    return await this.showService.removeWishedShow(userId, showId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('viewed/:userId/:showId')
  async removeViewedShow(
    @Param('userId') userId: number,
    @Param('showId') showId: number,
    @Request() req,
  ) {
    const user = req.user;
    // return { user}

    return await this.showService.removeViewedShow(userId, showId);
  }
}
