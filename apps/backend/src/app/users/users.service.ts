import { Get, Injectable, NotFoundException, Param } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Provider } from './entities/provider.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  async userGetAll() {
    const users = await this.userRepository.find();
    return { count: users.length, users };
  }

  async createUser(createUserDto: CreateUserDto) {
    const newSignup = await this.userRepository.create(createUserDto);
    await this.userRepository.save(newSignup);
    return newSignup;
  }

  //user 찾기(byid)
  async getUserById(id: string) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('No user Id');
    }
    return user;
  }

  //email로찾기
  async getUserByEmail(email: string) {
    const user = await this.userRepository.findOneBy({ email });
    if (!user) {
      throw new NotFoundException('No user Email');
    }
    return user;
  }
}
