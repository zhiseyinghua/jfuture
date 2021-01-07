import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { UserService } from './user/user.service';
import { TeamModule } from './team/team.module';
import { AliyunModule } from './aliyun/aliyun.module';
import { EventsGateway } from './subscription/events.gateway';


@Module({
  imports: [AuthModule, UserModule, TeamModule, AliyunModule],
  controllers: [AppController],
  providers: [AppService, UserService, EventsGateway],
})
export class AppModule {}
