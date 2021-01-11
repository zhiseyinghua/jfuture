import { ArgumentsHost, CanActivate, ExecutionContext, Injectable, Type } from '@nestjs/common';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Response } from 'supertest';
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
  constructor(Headers: any) { }
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    let idtoken = request.rawHeaders[1]
    console.log(idtoken)
    return AuthService.verifyIdtoken(idtoken)
  }
}