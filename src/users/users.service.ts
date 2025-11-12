import { Injectable, BadRequestException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { hash } from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(user: CreateUserDto) {
    try {
      if (!user.email && !user.phone) {
        throw new BadRequestException('Either email or phone is required');
      }

      if (user.email) {
        const exists = await this.prisma.users.findUnique({ where: { email: user.email } });
        if (exists) throw new BadRequestException('Email already in use');
      }

      if (user.phone) {
        const exists = await this.prisma.users.findUnique({ where: { phone: user.phone } });
        if (exists) throw new BadRequestException('Phone already in use');
      }

      const hashed = await hash(user.password, 10);
      const createdUser = await this.prisma.users.create({
        data: {
          name: user.name,
          email: user.email ?? null,
          phone: user.phone ?? null,
          password: hashed,
        },
      });

      return createdUser;
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException(error.message);
    }
  }

  async findAll() {
    try {
      return await this.prisma.users.findMany();
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findOne(id: number) {
    try {
      const user = await this.prisma.users.findUnique({
        where: { id: id },
      });
      if (!user) throw new NotFoundException(`User with id ${id} not found`);
      return user;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(error.message);
    }
  }

  async update(id: number, dto: UpdateUserDto) {
    try {
      const existing = await this.prisma.users.findUnique({ where: { id: id } });
      if (!existing) throw new NotFoundException(`User with id ${id} not found`);

      if (dto.email && dto.email !== existing.email) {
        const emailTaken = await this.prisma.users.findUnique({ where: { email: dto.email } });
        if (emailTaken) throw new BadRequestException('Email already in use');
      }

      if (dto.phone && dto.phone !== existing.phone) {
        const phoneTaken = await this.prisma.users.findUnique({ where: { phone: dto.phone } });
        if (phoneTaken) throw new BadRequestException('Phone already in use');
      }

      const data: any = {};
      if (dto.name !== undefined) data.name = dto.name;
      if (dto.email !== undefined) data.email = dto.email ?? null;
      if (dto.phone !== undefined) data.phone = dto.phone ?? null;
      if (dto.role !== undefined) data.role = dto.role;
      if (dto.password !== undefined) data.password = await hash(dto.password, 10);
      // don't allow manual updatedAt set here; Prisma will handle @updatedAt

      const updated = await this.prisma.users.update({
        where: { id: id },
        data,
      });

      return updated;
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(error.message);
    }
  }

  async remove(id: number) {
    try {
      // ensure exists
      const existing = await this.prisma.users.findUnique({ where: { id: id } });
      if (!existing) throw new NotFoundException(`User with id ${id} not found`);

      await this.prisma.users.delete({ where: { id: id } });
      return { deleted: true };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(error.message);
    }
  }
}
