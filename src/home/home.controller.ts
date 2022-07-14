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
import { Home, PropertyType } from '@prisma/client';
import { CreateHomeRequestDto } from 'src/DTOs/CreateHomeRequest.dto';
import { ResponseHomeDto } from 'src/DTOs/ResponseHome.dto';
import { UpdateHomeRequestDto } from 'src/DTOs/UpdateHome.dto';
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
  createHome(@Body() home: CreateHomeRequestDto) {
    return this.homeService.createHome(home);
  }

  @Put(':id')
  updateHome(
    @Param('id', ParseIntPipe) id: number,
    @Body() home: UpdateHomeRequestDto,
  ) {
    return this.homeService.updateHomeById(id, home);
  }

  @HttpCode(204)
  @Delete(':id')
  deleteHome(@Param('id', ParseIntPipe) id: number) {
    return this.homeService.deleteHomeById(id);
  }
}
