import {
  Controller, Get, Post, Delete, Body, Param, UseGuards, Request,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RatingsService } from './ratings.service';
import { CreateRatingDto } from './dto/create-rating.dto';

@Controller('businesses/:businessId/ratings')
export class RatingsController {
  constructor(private ratingsService: RatingsService) {}

  @Get()
  findAll(@Param('businessId') businessId: string) {
    return this.ratingsService.findByBusiness(businessId);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  createOrUpdate(
    @Request() req,
    @Param('businessId') businessId: string,
    @Body() dto: CreateRatingDto,
  ) {
    return this.ratingsService.createOrUpdate(req.user.id, businessId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    return this.ratingsService.remove(req.user.id, id);
  }
}
