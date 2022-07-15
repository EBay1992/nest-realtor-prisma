import { IsNotEmpty, IsString } from 'class-validator';

export class InquireDto {
  @IsNotEmpty()
  @IsString()
  message: string;
}
