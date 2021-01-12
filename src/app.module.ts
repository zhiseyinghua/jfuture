import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { UserService } from './user/user.service';
import { TeamModule } from './team/team.module';
import { AliyunModule } from './aliyun/aliyun.module';
import { TeammemberController } from './teammember/teammember.controller';
import { TeammemberService } from './teammember/teammember.service';
import { TeammemberModule } from './teammember/teammember.module';


@Module({
  imports: [AuthModule, UserModule, TeamModule, AliyunModule, TeammemberModule],
  controllers: [AppController, TeammemberController],
  providers: [AppService, UserService, TeammemberService],
})
export class AppModule {}
