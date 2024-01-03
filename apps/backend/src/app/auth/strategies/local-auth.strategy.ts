import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport';
import { AuthService } from '../auth.service';
import { User } from '../../users/entities/user.entity';

@Injectable()
export class LocalAuthStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email', //이메일값을 기준
    });
  }
  //검증되는 함수
  async validate(email: string, password: string): Promise<User> {
    return this.authService.login({ email, password });
  } //User로 리턴
}
