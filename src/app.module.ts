import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { ShowModule } from './show/show.module';
import { GenreModule } from './genre/genre.module';
import { User } from './user/entities/user.entity';
import { Genre } from './genre/entities/genre.entity';
import { Show } from './show/entities/show.entity';
import { AuthModule } from './auth/auth.module';
import { TmdbService } from './services/tmdb/tmdb.service';
import { Type } from 'class-transformer';

@Module({
  imports: [
        ConfigModule.forRoot({ envFilePath: ['.env'] }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DATABASE,
      entities: [User, Show, Genre],
      synchronize: false,
      logging: true,
    
    }),
    UserModule,
    ShowModule,
    GenreModule,
    AuthModule,
    TypeOrmModule.forFeature([User])
  ],
  controllers: [AppController],
  providers: [AppService, TmdbService],
})
export class AppModule {}
