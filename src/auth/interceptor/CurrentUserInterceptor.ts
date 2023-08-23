import { AppUserService } from './../../app-user/app-user.service';
//  this interceptor will be used by the custom param decoratro to fetch the current User
import {
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
// "implements" guide us how to put together an interceptor
export class CurrentUserInterceptor implements NestInterceptor {
  constructor(
    private jwtService: JwtService,
    private AppUserService: AppUserService,
  ) {}
  // handler refers to the route handler
  async intercept(context: ExecutionContext, handler: CallHandler) {
    const request = context.switchToHttp().getRequest();
    // console.log('request', request.headers.authorization);

    const [type, jwtString] = request.headers.authorization?.split(' ') ?? [];
    const decodedUser = this.jwtService.decode(jwtString);
    console.log('decoded user', decodedUser);

    request.currentUser = null;

    if (decodedUser) {
      const username = (decodedUser as { userName: string }).userName;

      const loggedUser = await this.AppUserService.findOneByUserName(username);

      request.currentUser = loggedUser;
    }

    return handler.handle();
  }
}
