import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { PropertyType, UserType } from '@prisma/client';
import { Roles } from 'src/Decorators/Roles.decorator';
import { User } from 'src/Decorators/User.decorator';
import { CreateHomeRequestDto } from 'src/DTOs/CreateHomeRequest.dto';
import { InquireDto } from 'src/DTOs/Inquire.dto';
import { ResponseHomeDto } from 'src/DTOs/ResponseHome.dto';
import { UpdateHomeRequestDto } from 'src/DTOs/UpdateHome.dto';
import { UserPayloadInfo } from 'src/Interfaces/UserInfo.interface';
import { HomeService } from './home.service';

@Controller('home')
export class HomeController {
  constructor(private readonly homeService: HomeService) {}

  @Get()
  getAllHomes(
    @Query('city') city?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('propertyType') propertyType?: PropertyType,
  ): Promise<ResponseHomeDto[]> {
    return this.homeService.getAllHomes(
      city,
      +minPrice,
      +maxPrice,
      propertyType,
    );
  }

  @Get(':id')
  getHomeById(@Param('id', ParseIntPipe) id: number) {
    return this.homeService.getHomeById(id);
  }

  @Post()
  @Roles(UserType.ADMIN, UserType.REALTOR)
  createHome(
    @Body() home: CreateHomeRequestDto,
    @User() user: UserPayloadInfo,
  ) {
    return this.homeService.createHome(home, user);
  }

  @Put(':id')
  @Roles(UserType.ADMIN, UserType.REALTOR)
  updateHome(
    @Param('id', ParseIntPipe) id: number,
    @Body() home: UpdateHomeRequestDto,
    @User() user: UserPayloadInfo,
  ) {
    return this.homeService.updateHomeById(id, home, user);
  }

  @HttpCode(204)
  @Delete(':id')
  @Roles(UserType.ADMIN, UserType.REALTOR)
  deleteHome(
    @Param('id', ParseIntPipe) id: number,
    @User() user: UserPayloadInfo,
  ) {
    return this.homeService.deleteHomeById(id, user);
  }

  @Roles(UserType.BUYER)
  @Post('/:homeId/inquire')
  inquire(
    @User() user: UserPayloadInfo,
    @Param('homeId', ParseIntPipe) homeId: number,
    @Body() { message }: InquireDto,
  ) {
    return this.homeService.inquire(homeId, user, message);
  }

  @Roles(UserType.ADMIN, UserType.REALTOR)
  @Get('/:homeId/messages')
  getMessagesByHome(
    @Param('homeId', ParseIntPipe) homeId: number,
    @User() realtor: UserPayloadInfo,
  ) {
    return this.homeService.getMessagesByHome(homeId, realtor);
  }
}

// realtor token
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywibmFtZSI6IkVoc2FuIiwiaWF0IjoxNjU3ODcxMzczLCJleHAiOjE2NTc5MDczNzN9.Akkh1ZKL4UwycUvZnyR4E0KOVCeK4Vi3FJzXsMdVe6I

// buyer token
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwibmFtZSI6InRlc3Q0QHRlc3QuY29tIiwiaWF0IjoxNjU3ODkwOTgzLCJleHAiOjE2NTc5MjY5ODN9.fcsBEqnizFYhg3KzTYViGNJWi_Ybn6W1V4IJonNy44M
