import {
  CallHandler,
  ExecutionContext,
  InternalServerErrorException,
  NestInterceptor,
  UnauthorizedException,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

export class UserInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler<any>) {
    const request = context.switchToHttp().getRequest();
    const token = request.headers?.authorization?.split('Bearer ')[1];

    if (!token) {
      throw new UnauthorizedException(
        'You need to login to access this resource',
      );
    }

    try {
      const decodedToken = jwt.decode(token);
      request.user = decodedToken;

      return next.handle();
    } catch (error) {
      console.log(error.message);

      throw new InternalServerErrorException('Something went wrong');
    }
  }
}
