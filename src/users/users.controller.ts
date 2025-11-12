import {
  Controller,
  Get,
  Req,
  Param,
  Post,
  Put,
  Patch,
  Delete,
  Query,
  Body,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  async create(@Body() data: CreateUserDto) {
    try {
      const result = await this.usersService.create(data);
      return {
        status: 200,
        success: true,
        message: 'User created successfully',
        data: result,
      };
    } catch (error) {
      return {
        status: 500,
        success: false,
        message: 'Internal server error',
        data: error.message,
      };
    }
  }
  @Get()
  async findAll() {
    try {
      const user = await this.usersService.findAll();

      return {
        status: 200,
        success: true,
        message: 'User data found successfully',
        data: user,
      };
    } catch (error) {
      return {
        status: 400,
        success: false,
        message: `error when get user: ${error}`,
        data: null,
      };
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const user = await this.usersService.findOne(+id);

      if (user) {
        return {
          status: 200,
          success: true,
          message: `User found with name ${user.name}`,
          data: user,
        };
      } else {
        return {
          status: 404,
          success: false,
          message: 'User not found',
          data: null,
        };
      }
    } catch (error) {
      return {
        status: 500,
        success: false,
        message: 'Internal server error',
        data: error.message,
      };
    }
  }
  @Patch(':id')
  async partialUpdate(@Param('id') id: string, @Body() data: UpdateUserDto) {
    try {
      const result = await this.usersService.update(+id, data);
      return {
        status: 200,
        success: true,
        message: 'User updated successfully',
        data: result,
      };
    } catch (error) {
      return {
        status: 500,
        success: false,
        message: 'Internal server error',
        data: error.message,
      };
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      const result = await this.usersService.remove(+id);
      return {
        status: 200,
        success: true,
        message: 'User deleted successfully',
        data: result,
      };
    } catch (error) {
      if (error.message.includes('No record was found for a delete')) {
        return {
          status: 404,
          success: false,
          message: 'User not found',
          data: null,
        };
      }
      return {
        status: 500,
        success: false,
        message: 'Internal server error',
        data: error.message,
      };
    }
  }
}
