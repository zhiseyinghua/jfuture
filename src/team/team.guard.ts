import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class TeamGuard implements CanActivate {
  constructor(private readonly AuthService: AuthService) {}
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    let authorization = request.headers['authorization'];
    console.log(authorization);
    if (!authorization) {
      return false;
    }
    return AuthService.verifyIdtoken(authorization);
  }
}

  