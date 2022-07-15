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
import { PropertyType } from '@prisma/client';
import { User } from 'src/Decorators/User.decorator';
import { CreateHomeRequestDto } from 'src/DTOs/CreateHomeRequest.dto';
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
  createHome(
    @Body() home: CreateHomeRequestDto,
    @User() user: UserPayloadInfo,
  ) {
    return this.homeService.createHome(home, user);
  }

  @Put(':id')
  updateHome(
    @Param('id', ParseIntPipe) id: number,
    @Body() home: UpdateHomeRequestDto,
    @User() user: UserPayloadInfo,
  ) {
    return this.homeService.updateHomeById(id, home, user);
  }

  @HttpCode(204)
  @Delete(':id')
  deleteHome(
    @Param('id', ParseIntPipe) id: number,
    @User() user: UserPayloadInfo,
  ) {
    return this.homeService.deleteHomeById(id, user);
  }
}
