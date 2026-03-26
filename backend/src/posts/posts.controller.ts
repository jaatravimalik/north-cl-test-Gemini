import {
  Controller, Get, Post, Delete, Body, Param, Query, UseGuards, Request,
  UseInterceptors, UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuid } from 'uuid';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PostsService } from './posts.service';

const multerOptions = {
  storage: diskStorage({
    destination: './uploads',
    filename: (req, file, cb) => {
      cb(null, uuid() + extname(file.originalname));
    },
  }),
};

@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @Get()
  getFeed(@Query('page') page: string, @Query('limit') limit: string) {
    return this.postsService.getFeed(
      parseInt(page) || 1,
      parseInt(limit) || 10,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('image', multerOptions))
  create(
    @Request() req,
    @Body('content') content: string,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const imageUrl = file ? `/uploads/${file.filename}` : undefined;
    return this.postsService.create(req.user.id, content, imageUrl);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    return this.postsService.remove(req.user.id, id);
  }
}
