import {
  Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ExperienceService } from './experience.service';
import { CreateExperienceDto } from './dto/create-experience.dto';

@Controller('users/me/experience')
@UseGuards(JwtAuthGuard)
export class ExperienceController {
  constructor(private expService: ExperienceService) {}

  @Get()
  findAll(@Request() req) {
    return this.expService.findByUser(req.user.id);
  }

  @Post()
  create(@Request() req, @Body() dto: CreateExperienceDto) {
    return this.expService.create(req.user.id, dto);
  }

  @Put(':id')
  update(@Request() req, @Param('id') id: string, @Body() dto: CreateExperienceDto) {
    return this.expService.update(req.user.id, id, dto);
  }

  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    return this.expService.remove(req.user.id, id);
  }
}
