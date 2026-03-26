import {
  Controller, Get, Post, Param, Query, Body, UseGuards, Request,
  UseInterceptors, UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuid } from 'uuid';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { BusinessService } from './business.service';
import { CreateBusinessDto } from './dto/create-business.dto';

const multerOptions = {
  storage: diskStorage({
    destination: './uploads',
    filename: (req, file, cb) => {
      cb(null, uuid() + extname(file.originalname));
    },
  }),
};

@Controller('businesses')
export class BusinessController {
  constructor(private bizService: BusinessService) {}

  @Get()
  findAll(@Query('q') q: string, @Query('category') category: string) {
    return this.bizService.findAll(q, category);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bizService.findById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('image', multerOptions))
  create(
    @Request() req,
    @Body() dto: CreateBusinessDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const imageUrl = file ? `/uploads/${file.filename}` : undefined;
    return this.bizService.create(req.user.id, dto, imageUrl);
  }
}
