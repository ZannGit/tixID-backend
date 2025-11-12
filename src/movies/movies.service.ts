import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';

@Injectable()
export class MoviesService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateMovieDto) {
  return this.prisma.movies.create({
    data: {
      title: dto.title,
      sinopsis: dto.sinopsis,
      genre: dto.genre,
      duration: dto.duration,
      rating: dto.rating,
      posterUrl: dto.posterUrl,
      dateRelease: dto.dateReleased,
    },
  });
}


  findAll() {
    return this.prisma.movies.findMany();
  }

  findOne(id: number) {
    return this.prisma.movies.findUnique({ where: { id } });
  }

  update(id: number, dto: UpdateMovieDto) {
    return this.prisma.movies.update({ where: { id }, data: dto });
  }

  remove(id: number) {
    return this.prisma.movies.delete({ where: { id } });
  }
}
