import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { UserService } from './user/user.service';
import { TeamModule } from './team/team.module';
import { AliyunModule } from './aliyun/aliyun.module';
import { EventsGateway } from './subscription/events.gateway';
import { FigureController } from './figure/figure.controller';
import { FigureService } from './figure/figure.service';
import { TeammemberService } from './teammember/teammember.service';
import { TeammemberModule } from './teammember/teammember.module';
import { CatsModule } from './cats/cats.module';


@Module({
  imports: [AuthModule, UserModule, TeamModule, AliyunModule,TeammemberModule, CatsModule],
  controllers: [AppController, FigureController],
  providers: [AppService, UserService, EventsGateway, FigureService,TeammemberService],
})
export class AppModule {}
