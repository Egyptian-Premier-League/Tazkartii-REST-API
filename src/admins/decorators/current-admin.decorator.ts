import {
  createParamDecorator,
  ExecutionContext,
  NotFoundException,
} from '@nestjs/common';
export const CurrentAdmin = createParamDecorator(
  (data: never, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    if (!request.currentAdmin) throw new NotFoundException('Admin not found');
    return request.currentAdmin;
  },
);
