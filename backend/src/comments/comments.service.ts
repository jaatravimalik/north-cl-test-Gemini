import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from '../entities/comment.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,
  ) {}

  async findByPost(postId: string) {
    return this.commentsRepository.find({
      where: { postId },
      relations: ['user'],
      order: { createdAt: 'ASC' },
    });
  }

  async create(userId: string, postId: string, content: string) {
    const comment = this.commentsRepository.create({ userId, postId, content });
    const saved = await this.commentsRepository.save(comment);
    return this.commentsRepository.findOne({
      where: { id: saved.id },
      relations: ['user'],
    });
  }
}
