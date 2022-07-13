import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { Home, PropertyType } from '@prisma/client';
import { ResponseHomeDto } from 'src/DTOs/ResponseHome.dto';
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
  getHomeById(@Param('id') id: string) {
    return `This action returns a #${id} home`;
  }

  @Post()
  createHome(@Body() home: Home) {
    return `This action adds a new home`;
  }

  @Put(':id')
  updateHome(@Param('id') id: string, @Body() home: Home) {
    return `This action updates a #${id} home`;
  }

  @Delete(':id')
  deleteHome(@Param('id') id: string) {
    return `This action removes a #${id} home`;
  }
}
