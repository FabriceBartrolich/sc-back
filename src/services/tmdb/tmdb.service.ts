import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { title } from 'process';

@Injectable()
export class TmdbService {
    private base_url = 'https://api.themoviedb.org/3';
    private apiKey = process.env.API_KEY;
    private token = process.env.TOKEN;
    
    
    async searchShow(title: string) {
       const url=`${this.base_url}/search/tv?api_key=${this.apiKey}&language=fr-FR&query=${title}`; 
       try {
        const response = await axios.get(url);
        return response.data;
       } catch (error) {
        throw new Error(`'Pas de résultat pour cette recherche: ${error.message}`)
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
