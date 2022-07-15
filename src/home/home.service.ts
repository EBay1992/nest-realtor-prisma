import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PropertyType } from '@prisma/client';
import { CreateHomeRequestDto } from 'src/DTOs/CreateHomeRequest.dto';
import { ResponseHomeDto } from 'src/DTOs/ResponseHome.dto';
import { UpdateHomeRequestDto } from 'src/DTOs/UpdateHome.dto';
import { UserPayloadInfo } from 'src/Interfaces/UserInfo.interface';
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

  async createHome(
    {
      city,
      address,
      price,
      images,
      land_size,
      number_of_bathroom,
      number_of_rooms,
      propertyType,
    }: CreateHomeRequestDto,
    user: UserPayloadInfo,
  ): Promise<any> {
    const newHome = await this.prisma.home.create({
      data: {
        address,
        city,
        price,
        propertyType,
        number_of_bathroom,
        number_of_rooms,
        land_size,
        realtor_id: user.id,
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
    user: UserPayloadInfo,
  ): Promise<ResponseHomeDto> {
    const foundHome = await this.prisma.home.findUnique({ where: { id } });

    if (foundHome && foundHome.realtor_id !== user.id) {
      throw new UnauthorizedException(
        'You are not authorized to update this home',
      );
    }

    if (!foundHome) throw new NotFoundException('Home by this id not found');

    const updatedHome = await this.prisma.home.update({
      where: { id },
      data: { ...foundHome, ...home, updatedAt: new Date() },
    });

    return new ResponseHomeDto(updatedHome);
  }

  async deleteHomeById(id: number, user: UserPayloadInfo): Promise<any> {
    const foundHome = await this.prisma.home.findUnique({ where: { id } });

    if (foundHome && foundHome.realtor_id !== user.id) {
      throw new UnauthorizedException(
        'You are not authorized to delete this home',
      );
    }

    if (!foundHome) throw new NotFoundException('Home by this id not found');

    await this.prisma.image.deleteMany({ where: { home_id: id } });

    return await this.prisma.home.delete({ where: { id } });
  }

  async inquire(homeId: number, user: UserPayloadInfo, message: string) {
    const searchedHome = await this.getHomeById(homeId);

    return this.prisma.message.create({
      data: {
        message,
        buyer_id: user.id,
        home_id: homeId,
        realtor_id: searchedHome.realtor_id,
      },
    });
  }

  async getMessagesByHome(homeId: number, user: UserPayloadInfo) {
    const searchedHome = await this.getHomeById(homeId);

    if (searchedHome.realtor_id !== user.id) {
      throw new UnauthorizedException(
        'You have not access to the messages of this home.',
      );
    }

    const messages = await this.prisma.message.findMany({
      where: { home_id: homeId, realtor_id: user.id },
      select: {
        message: true,
        buyer: {
          select: {
            name: true,
            phone: true,
            email: true,
          },
        },
      },
    });

    if (!messages)
      throw new NotFoundException('You have no inquires related to this home.');

    return messages;
  }
}
