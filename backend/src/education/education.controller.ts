import {
  Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { EducationService } from './education.service';
import { CreateEducationDto } from './dto/create-education.dto';

@Controller('users/me/education')
@UseGuards(JwtAuthGuard)
export class EducationController {
  constructor(private eduService: EducationService) {}

  @Get()
  findAll(@Request() req) {
    return this.eduService.findByUser(req.user.id);
  }

  @Post()
  create(@Request() req, @Body() dto: CreateEducationDto) {
    return this.eduService.create(req.user.id, dto);
  }

  @Put(':id')
  update(@Request() req, @Param('id') id: string, @Body() dto: CreateEducationDto) {
    return this.eduService.update(req.user.id, id, dto);
  }

  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    return this.eduService.remove(req.user.id, id);
  }
}
