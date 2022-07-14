import { PropertyType } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';

class Image {
  @IsString()
  @IsNotEmpty()
  url: string;
}

export class CreateHomeRequestDto {
  @IsString()
  @IsNotEmpty()
  address: string;

  @IsNumber()
  @IsPositive()
  number_of_rooms: number;

  @IsNumber()
  @IsPositive()
  number_of_bathroom: number;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsNumber()
  @IsPositive()
  price: number;

  @IsEnum(PropertyType)
  propertyType: PropertyType;

  @IsNumber()
  @IsPositive()
  land_size: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Image)
  images: Image[];
}
