import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { title } from 'process';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TmdbService {
    private base_url = 'https://api.themoviedb.org/3';
    private apiKey = process.env.API_KEY;
    private token = process.env.TOKEN;
    
    constructor(
       @InjectRepository(User)
    private userRepository: Repository<User>,
    ) {}
    
    async searchShow(title: string, userId: number) {
       const url=`${this.base_url}/search/tv?api_key=${this.apiKey}&language=fr-FR&query=${title}`; 
     const me = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['viewedShows', 'wishedShows'],
    });
         try {
        const response = await axios.get(url);
        response.data.results= response.data.results.map(show => {
          const isViewed = me.viewedShows.find(viewedShow => viewedShow.api_id == show.id);
          const isWished = me.wishedShows.find(wishedShow => wishedShow.api_id == show.id);
          return {
            ...show,
          is_viewed: isViewed ? true : false,
          is_wished: isWished ? true : false,
          }
        });
        return response.data;
       } catch (error) {
        throw new Error(`'Pas de résultat pour cette recherche: ${error.message}`)
       }
    }


    

//     async getPopularShows(page: number = 1) {
//   const url = `${this.base_url}/tv/popular?api_key=${this.apiKey}&language=fr-FR&page=${page}`;
//   try {
//     const response = await axios.get(url);
//     return response.data;
//   } catch (error) {
//     throw new Error(`Erreur lors de la récupération des séries populaires: ${error.message}`);
//   }
// }

async getPopularShows(page: number = 1) {
  const url = `${this.base_url}/tv/popular?api_key=${this.apiKey}&language=fr-FR&page=${page}`;
  try {
    const response = await axios.get(url);
    // const posterPaths = response.data.results.map(show => show.poster_path);
    return response.data.results;
  } catch (error) {
    throw new Error(`Erreur lors de la récupération des séries populaires: ${error.message}`);
  }
}


 async searchShowById(id: number) {
       const url=`${this.base_url}/tv/${id}?append_to_response=similar&language=fr-FR`; 
       const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${this.token}`,
        }
       }
       try {
        const response = await axios.get(url, {headers: options.headers});
        return response.data;
       } catch (error) {
        throw new Error(`'Pas de résultat pour cette recherche: ${error.message}`)
       }
  
    }


}   
