import {
  Body,
  Controller,
  Get,
  Param,
  ParseEnumPipe,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { UserType } from '@prisma/client';
import { GenerateProductKeyDto } from 'src/DTOs/GenerateProductKey.dto';
import { SignInDto } from 'src/DTOs/SignIn.dto';
import { SignupDto } from 'src/DTOs/Signup.dto';
import { AuthService } from './auth.service';
import * as bcrypt from 'bcryptjs';
import { UserPayloadInfo } from 'src/Interfaces/UserInfo.interface';
import { User } from 'src/Decorators/User.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup/:userType')
  async signup(
    @Body() body: SignupDto,
    @Param('userType', new ParseEnumPipe(UserType)) userType: UserType,
  ) {
    if (userType !== UserType.BUYER) {
      if (!body.productKey) {
        throw new UnauthorizedException('Product key is required');
      }

      const productKey = `{${body.email}}-${userType}-${process.env.PRODUCT_KEY_SECRET}`;
      const isValidProductKey = await bcrypt.compare(
        productKey,
        body.productKey,
      );

      if (!isValidProductKey) {
        throw new UnauthorizedException('Product key is invalid');
      }
    }

    return this.authService.signup(body, userType);
  }

  @Post('/signIn')
  signIn(@Body() body: SignInDto) {
    return this.authService.signIn(body);
  }

  @Post('/key')
  async generateProductKey(@Body() { userType, email }: GenerateProductKeyDto) {
    return this.authService.generateProductKey(email, userType);
  }

  @Get('/me')
  me(@User() user: UserPayloadInfo) {
    return this.authService.me(user);
  }
}
