import { Controller, Post, Get, Param, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { LikesService } from './likes.service';

@Controller('posts/:postId/like')
export class LikesController {
  constructor(private likesService: LikesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  toggle(@Request() req, @Param('postId') postId: string) {
    return this.likesService.toggle(req.user.id, postId);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  isLiked(@Request() req, @Param('postId') postId: string) {
    return this.likesService.isLiked(req.user.id, postId);
  }
}
