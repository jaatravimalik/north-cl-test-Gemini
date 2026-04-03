import {
  Controller, Get, Post, Delete, Body, Param, Query, UseGuards, Request,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PostsService } from './posts.service';

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
  create(
    @Request() req,
    @Body('content') content: string,
  ) {
    return this.postsService.create(req.user.id, content, undefined);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    return this.postsService.remove(req.user.id, id);
  }
}
