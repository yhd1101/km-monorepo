import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  UseGuards,
  Req,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginUserDto } from '../users/dto/login-user.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { RequestWithUserInterface } from './requestWithUser.interface';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { GoogleAuthGuard } from './guards/google-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async userSignup(@Body() createUserDto: CreateUserDto) {
    return await this.authService.createUser(createUserDto);
  }

  @Post('login')
  @HttpCode(200)
  @UseGuards(LocalAuthGuard) //Guard에서 검증됨
  async userLogin(@Req() req: RequestWithUserInterface) {
    const user = req.user;
    const token = await this.authService.generateAccessToken(user.id);
    return { token, user };
    // return await this.authService.Login(loginUserDto);
  }

  @Get()
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async getUserInfoByToken(@Req() req: RequestWithUserInterface) {
    const { user } = req;
    user.password = undefined;
    return user;
  }

  //구글에 접속하는 코드(로그인요청 코드)
  @HttpCode(200)
  @Get('google')
  @UseGuards(GoogleAuthGuard)
  async googleLogin(): Promise<any> {
    return HttpStatus.OK;
  }

  //요청을 받고 구글에서 던져주는 정보를 아래 api에 받겠다.
  @HttpCode(200)
  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleLoginCallBack(@Req() req: any): Promise<any> {
    const { user } = req;
    const token = await this.authService.generateAccessToken(user.id);
    return { token, user };
  }
}
