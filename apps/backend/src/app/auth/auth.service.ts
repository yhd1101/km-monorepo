import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginUserDto } from '../users/dto/login-user.dto';
import { TokenPayloadInterface } from './tokenPayload.interface';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  //회원가입
  async createUser(createUserDto: CreateUserDto) {
    const user = await this.usersService.createUser(createUserDto);
    return user;
  }

  async login(loginUserDto: LoginUserDto) {
    const user = await this.usersService.getUserByEmail(loginUserDto.email);
    const isPasswordMatched = await user.validatePassword(
      loginUserDto.password
    ); //성공여부
    if (!isPasswordMatched) {
      throw new HttpException(
        'Password do not matched',
        HttpStatus.BAD_REQUEST
      );
    } //email에서 입력한 패스워드랑 우리가 찾는 패스워드가 같지 않으면
    user.password = undefined;
    return user;
  }

  //access토큰 생성함수
  public generateAccessToken(userId: string) {
    const payload: TokenPayloadInterface = { userId };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('ACCESSTOKEN_SECRET_KEY'),
      expiresIn: `${this.configService.get('ACCESSTOKEN_EXPIRATION_TIME')}m`,
    });
    return token;
  }
}
