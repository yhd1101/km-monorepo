//jwt를 검증해주는 로직
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../../users/users.service';
import { ConfigService } from '@nestjs/config';
import { TokenPayloadInterface } from '../tokenPayload.interface';

@Injectable()
export class JwtAuthStategy extends PassportStrategy(Strategy) {
  constructor(
    private usersService: UsersService,
    private configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('ACCESSTOKEN_SECRET_KEY'),
    });
  }
  //토큰검증해주는 함수
  async validate(payload: TokenPayloadInterface) {
    return this.usersService.getUserById(payload.userId);
  }
