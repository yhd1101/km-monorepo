import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/create')
  async postSignup(@Body() cr: CreateUserDto) {}

  @Get()
  async getAllUsers() {
    const users = await this.usersService.userGetAll();
    return users;
  }

  @Get(':id')
  async getUserById(@Param('id') id: string) {
    const user = await this.usersService.getUserById(id);
    return user;
  }
}
