import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { GoogleAuthGuard } from './guards/google-auth.guard';

@Module({
  imports: [UsersModule, ConfigModule, JwtModule.register({}), PassportModule],
  controllers: [AuthController],
  providers: [AuthService, LocalAuthGuard, JwtAuthGuard, GoogleAuthGuard],
})
export class AuthModule {}
