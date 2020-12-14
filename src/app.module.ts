import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
<<<<<<< HEAD
import { UserService } from './user/user.service';
import { UserModule } from './user/user.module';
=======
import { UserModule } from './user/user.module';

>>>>>>> dev-hxy

@Module({
  imports: [AuthModule, UserModule],
  controllers: [AppController],
  providers: [AppService, UserService],
})
export class AppModule {}
