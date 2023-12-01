import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { UsersService } from '../users.service';

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
  constructor(private userService: UsersService) {}
  async intercept(context: ExecutionContext, next: CallHandler<any>) {
    const request = context.switchToHttp().getRequest();
    if (!request.user) {
      return next.handle();
    }
    const userId = request.user.userId;
    if (userId) {
      const student = await this.userService.findUserById(userId);
      request.currentUser = student;
    }

    // This means go ahead and run the actual route handler
    return next.handle();
  }
}
