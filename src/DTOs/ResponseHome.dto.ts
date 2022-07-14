import { PropertyType } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';

export class ResponseHomeDto {
  @Exclude()
  id: number;

  address: string;

  @Exclude()
  number_of_rooms: number;
  @Expose({ name: 'numberOfRooms' })
  getNumberOfRooms(): number {
    return this.number_of_rooms;
  }

  @Exclude()
  number_of_bathroom: number;
  @Expose({ name: 'numberOfBathroom' })
  getNumberOfBathroom(): number {
    return this.number_of_bathroom;
  }

  city: string;

  @Exclude()
  listed_date: Date;
  @Expose({ name: 'listedDate' })
  getListedDate(): Date {
    return this.listed_date;
  }

  price: number;
  propertyType: PropertyType;

  @Exclude()
  land_size: number;
  @Expose({ name: 'landSize' })
  getLandSize(): number {
    return this.land_size;
  }

  image: string;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;

  @Exclude()
  realtor_id: number;

  @Exclude()
  messages: any[];

  realtors: any[];

  constructor(partial: Partial<ResponseHomeDto>) {
    Object.assign(this, partial);
  }
}
