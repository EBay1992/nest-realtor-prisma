import {
  CallHandler,
  ExecutionContext,
  InternalServerErrorException,
  NestInterceptor,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

export class UserInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler<any>) {
    const request = context.switchToHttp().getRequest();
    const token = request.headers?.authorization?.split('Bearer ')[1];

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
