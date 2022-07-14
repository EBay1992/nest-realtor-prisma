import { Injectable, NotFoundException } from '@nestjs/common';
import { PropertyType } from '@prisma/client';
import { CreateHomeRequestDto } from 'src/DTOs/CreateHomeRequest.dto';
import { ResponseHomeDto } from 'src/DTOs/ResponseHome.dto';
import { UpdateHomeRequestDto } from 'src/DTOs/UpdateHome.dto';
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

  async getHomeById(id: number): Promise<ResponseHomeDto> {
    const home = await this.prisma.home.findUnique({
      where: { id },
      include: {
        images: {
          select: {
            url: true,
          },
        },
        realtor: {
          select: {
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    if (!home) throw new NotFoundException('Home not found');

    return new ResponseHomeDto(home);
  }

  async createHome({
    city,
    address,
    price,
    images,
    land_size,
    number_of_bathroom,
    number_of_rooms,
    propertyType,
  }: CreateHomeRequestDto): Promise<any> {
    console.log({
      address,
      city,
      price,
      propertyType,
      number_of_bathroom,
      number_of_rooms,
      land_size,
      realtor_id: 5,
    });

    const newHome = await this.prisma.home.create({
      data: {
        address,
        city,
        price,
        propertyType,
        number_of_bathroom,
        number_of_rooms,
        land_size,
        realtor_id: 5,
      },
    });

    await this.prisma.image.createMany({
      data: images.map((image) => ({
        ...image,
        home_id: newHome.id,
      })),
    });

    return new ResponseHomeDto(newHome);
  }

  async updateHomeById(
    id: number,
    home: UpdateHomeRequestDto,
  ): Promise<ResponseHomeDto> {
    const foundHome = await this.prisma.home.findUnique({ where: { id } });

    if (!foundHome) throw new NotFoundException('Home by this id not found');

    const updatedHome = await this.prisma.home.update({
      where: { id },
      data: { ...foundHome, ...home, updatedAt: new Date() },
    });

    return new ResponseHomeDto(updatedHome);
  }

  async deleteHomeById(id: number): Promise<any> {
    const foundHome = await this.prisma.home.findUnique({ where: { id } });

    if (!foundHome) throw new NotFoundException('Home by this id not found');

    await this.prisma.image.deleteMany({ where: { home_id: id } });

    return await this.prisma.home.delete({ where: { id } });
  }
}
