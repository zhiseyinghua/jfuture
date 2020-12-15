import { ArgumentsHost, CanActivate, ExecutionContext, Injectable, Type } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
// export class AuthGuard implements CanActivate {
//   canActivate(
//     context: ExecutionContext,
//   ): boolean | Promise<boolean> | Observable<boolean> {
//     const request = context.switchToHttp().getRequest();
//     console.log("AuthGuard  "+request.user);
//     const url = request.route.path;
//     console.log("AuthGuard  url"+request.user,url);
//       console.log(request);
//     return true;
//   }
// }

export class AuthGuard implements CanActivate {
  constructor(private readonly AuthService: AuthService) {}
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    let authorization = request.headers['authorization'];
    let authorinfo=AuthService.decodeIdtoken(authorization);
    let authorinforange=authorinfo.range
    console.log(authorinforange);
    if (!authorinforange) {
      return false;
    }
    return AuthService.verifyIdtoken(authorization);
  }
}
