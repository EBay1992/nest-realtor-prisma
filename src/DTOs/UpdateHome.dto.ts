import { PropertyType } from '@prisma/client';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class UpdateHomeRequestDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  address?: string;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  number_of_rooms?: number;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  number_of_bathroom?: number;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  city?: string;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  price?: number;

  @IsEnum(PropertyType)
  @IsOptional()
  propertyType?: PropertyType;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  land_size?: number;
}
