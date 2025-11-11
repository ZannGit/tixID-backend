import { Injectable } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';

@Injectable()
export class MoviesService {

  private movies = [
    {id : 1, title: 'Boboiboy Galaxy', genre: 'Action', duration: '110 menit'},
    {id: 2, title: 'Sore', genre: 'Romance', duration: '115 menit'},
  ];

  create(createMovieDto: CreateMovieDto) {
    const newMovie: any = { id: Date.now(), ...createMovieDto };
    this.movies.push(newMovie);
    return newMovie;
  }

  findAll() {
    return this.movies;
  }

  findOne(id: number) {
    return this.movies.find((movie) => movie.id === id);
  }

  update(id: number, updateMovieDto: UpdateMovieDto) {
    const index = this.movies.findIndex((m) => m.id === id);
    if (index > -1) {
      this.movies[index] = { ...this.movies[index], ...updateMovieDto };
      return this.movies[index];
    }
    return null;
  }

  remove(id: number) {
    const index = this.movies.findIndex((m) => m.id === id);
    if (index > -1) {
      const deleted = this.movies.splice(index, 1);
      return deleted[0];
    }
    return null;
  }
}
