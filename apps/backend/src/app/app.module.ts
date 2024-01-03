import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';
import { AppConfigModule } from './common/config/config.module';
import { ProductModule } from './product/product.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [AppConfigModule, UsersModule, DatabaseModule, ProductModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
