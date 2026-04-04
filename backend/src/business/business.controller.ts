import {
  Controller, Get, Post, Put, Param, Query, Body, UseGuards, Request,
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

  /** Owner's own business listings */
  @UseGuards(JwtAuthGuard)
  @Get('my')
  getMyListings(@Request() req) {
    return this.bizService.findByOwner(req.user.id);
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

  /** Edit business listing — owner only */
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(
    @Request() req,
    @Param('id') id: string,
    @Body() dto: Partial<CreateBusinessDto>,
  ) {
    return this.bizService.update(req.user.id, id, dto);
  }

  /** Upload/replace business logo — owner only */
  @UseGuards(JwtAuthGuard)
  @Post(':id/logo')
  @UseInterceptors(FileInterceptor('logo', multerOptions))
  uploadLogo(
    @Request() req,
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const imageUrl = `/uploads/${file.filename}`;
    return this.bizService.updateLogo(req.user.id, id, imageUrl);
  }
}
