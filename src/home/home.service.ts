import { Injectable, NotFoundException } from '@nestjs/common';
import { PropertyType } from '@prisma/client';
import { ResponseHomeDto } from 'src/DTOs/ResponseHome.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class HomeService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllHomes(
    city: string,
    minPrice: number,
    maxPrice: number,
    propertyType: PropertyType,
  ): Promise<ResponseHomeDto[]> {
    const homes = await this.prisma.home.findMany({
      where: {
        price:
          (minPrice && maxPrice && { lt: maxPrice, gte: minPrice }) ||
          (minPrice && { gte: minPrice }) ||
          (maxPrice && { lte: maxPrice }) ||
          undefined,
        city: (city && { equals: city }) || undefined,
        propertyType: (propertyType && { equals: propertyType }) || undefined,
      },
      select: {
        id: true,
        address: true,
        city: true,
        price: true,
        propertyType: true,
        number_of_bathroom: true,
        number_of_rooms: true,
        images: {
          select: {
            url: true,
          },
          take: 1,
        },
      },
    });

    if (homes.length === 0) {
      throw new NotFoundException('No homes found');
    }

    return homes.map((home) => {
      const fetchedHome = { ...home, image: home.images[0].url };
      delete fetchedHome.images;

      return new ResponseHomeDto(fetchedHome);
    });
  }
}
