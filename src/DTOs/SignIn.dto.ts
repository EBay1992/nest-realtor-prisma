import { IsEmail, IsOptional, IsString } from 'class-validator';

export class SignInDto {
  @IsEmail({ message: 'Email must be a valid email' })
  email: string;

  @IsString()
  password: string;
}
