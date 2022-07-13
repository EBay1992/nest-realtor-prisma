import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { SignupDto } from 'src/DTOs/Signup.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { UserType } from '@prisma/client';
import { SignInDto } from 'src/DTOs/SignIn.dto';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}
  async signup(
    body: SignupDto,
    userType: UserType = UserType.BUYER,
  ): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { email: body.email },
    });

    if (!user) {
      try {
        const hashedPassword = await bcrypt.hash(body.password, 10);

        const user = await this.prisma.user.create({
          data: {
            email: body.email,
            name: body.name,
            phone: body.phone,
            password: hashedPassword,
            user_Type: userType,
          },
        });

        const token = this.generateToken(user.id, user.name);

        return token;
      } catch (err) {
        throw err;
      }
    } else {
      return new ConflictException('User already exists');
    }
  }

  async signIn(body: SignInDto): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { email: body.email },
    });

    if (user) {
      const isPasswordMatched = await bcrypt.compare(
        body.password,
        user.password,
      );

      if (isPasswordMatched) {
        const token = this.generateToken(user.id, user.name);

        return token;
      } else {
        throw new ConflictException('Wrong password');
      }
    } else {
      throw new BadRequestException('User does not exist');
    }
  }

  async generateProductKey(email: string, userType: UserType) {
    const string = `{${email}}-${userType}-${process.env.PRODUCT_KEY_SECRET}`;
    return await bcrypt.hash(string, 10);
  }

  private generateToken(id: number, name: string): string {
    return jwt.sign({ id, name }, process.env.JSON_WEB_TOKEN_SECRET, {
      expiresIn: 36000,
    });
  }
}
