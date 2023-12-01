import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { AdminsService } from '../admins.service';

@Injectable()
export class CurrentAdminInterceptor implements NestInterceptor {
  constructor(private adminService: AdminsService) {}
  async intercept(context: ExecutionContext, next: CallHandler<any>) {
    const request = context.switchToHttp().getRequest();
    if (!request.user || request.user.role !== 'Admin') {
      return next.handle();
    }
    const adminId = request.user.userId;
    if (adminId) {
      const admin = await this.adminService.findAdminById(adminId);
      request.currentAdmin = admin;
    }

    // This means go ahead and run the actual route handler
    return next.handle();
  }
}
