import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppUserModule } from './app-user/app-user.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [AppUserModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
