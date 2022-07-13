import { UserType } from '@prisma/client';
import { IsEmail, IsEnum } from 'class-validator';

export class GenerateProductKeyDto {
  @IsEmail({ message: 'Email must be a valid email' })
  email: string;

  @IsEnum(UserType)
  userType: UserType;
}
