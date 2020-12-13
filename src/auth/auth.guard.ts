import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    // console.log("AuthGuard  "+request.user);
    // const url = request.route.path;
    // console.log("AuthGuard  url"+request.user,url);
    //   console.log(request);
    //白名单的直接返回
    return true;
  }
}
