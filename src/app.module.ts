import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { UserService } from './user/user.service';
import { TeamModule } from './team/team.module';


@Module({
  imports: [AuthModule, UserModule, TeamModule],
  controllers: [AppController],
  providers: [AppService, UserService],
})
export class AppModule {}
