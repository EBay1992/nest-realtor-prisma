import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserType } from '@prisma/client';
import * as jwt from 'jsonwebtoken';
import { UserPayloadInfo } from 'src/Interfaces/UserInfo.interface';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly prisma: PrismaService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.getAllAndOverride<UserType[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (roles?.length) {
      const token = context
        .switchToHttp()
        .getRequest()
        .headers?.authorization?.split('Bearer ')[1];

      if (!token) return false;

      const verifiedUser = jwt.verify(
        token,
        process.env.JSON_WEB_TOKEN_SECRET,
      ) as UserPayloadInfo;

      const foundedUser = await this.prisma.user.findUnique({
        where: { id: verifiedUser.id },
      });

      if (!foundedUser) return false;

      if (!roles.includes(foundedUser.user_Type)) {
        return false;
      }

      return true;
    } else {
      return true; //no rule specified; so guard is not needed!
    }
  }
}
