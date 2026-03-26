import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Like } from '../entities/like.entity';
import { PostsService } from '../posts/posts.service';

@Injectable()
export class LikesService {
  constructor(
    @InjectRepository(Like)
    private likesRepository: Repository<Like>,
    private postsService: PostsService,
  ) {}

  async toggle(userId: string, postId: string) {
    const existing = await this.likesRepository.findOne({
      where: { userId, postId },
    });

    if (existing) {
      await this.likesRepository.remove(existing);
      await this.postsService.incrementLikes(postId, -1);
      return { liked: false };
    } else {
      const like = this.likesRepository.create({ userId, postId });
      await this.likesRepository.save(like);
      await this.postsService.incrementLikes(postId, 1);
      return { liked: true };
    }
  }

  async isLiked(userId: string, postId: string) {
    const like = await this.likesRepository.findOne({
      where: { userId, postId },
    });
    return { liked: !!like };
  }
}
