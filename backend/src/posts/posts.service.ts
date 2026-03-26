import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../entities/post.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
  ) {}

  async getFeed(page = 1, limit = 10) {
    const [posts, total] = await this.postsRepository.findAndCount({
      relations: ['user', 'comments'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return {
      posts: posts.map((p) => ({
        ...p,
        commentsCount: p.comments?.length || 0,
        comments: undefined,
      })),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async create(userId: string, content: string, imageUrl?: string) {
    const post = this.postsRepository.create({ userId, content, imageUrl });
    const saved = await this.postsRepository.save(post);
    return this.postsRepository.findOne({
      where: { id: saved.id },
      relations: ['user'],
    });
  }

  async findById(id: string) {
    const post = await this.postsRepository.findOne({
      where: { id },
      relations: ['user', 'comments', 'comments.user'],
    });
    if (!post) throw new NotFoundException('Post not found');
    return post;
  }

  async remove(userId: string, id: string) {
    const post = await this.postsRepository.findOne({ where: { id } });
    if (!post) throw new NotFoundException('Post not found');
    if (post.userId !== userId) throw new ForbiddenException();
    await this.postsRepository.remove(post);
    return { deleted: true };
  }

  async incrementLikes(postId: string, delta: number) {
    await this.postsRepository.increment({ id: postId }, 'likesCount', delta);
  }
}
